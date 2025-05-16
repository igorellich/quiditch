import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';

// Hyperparameters
const LEARNING_RATE = 0.001;
const DISCOUNT_FACTOR = 0.95;
const EPSILON_START = 1.0;
const EPSILON_END = 0.01;
const EPSILON_DECAY = 0.995;
const BATCH_SIZE = 64;
const MEMORY_CAPACITY = 10000;
const EPISODES = 1000;
const MAX_STEPS_PER_EPISODE = 200;

// Environment parameters
const GRID_SIZE = 5;
const NUM_ITEMS = 3;
const NUM_ENEMIES = 2;
const NUM_ACTIONS = 4; // Up, Down, Left, Right

interface GameState {
    agentPosition: [number, number];
    items: Array<[number, number]>;
    enemies: Array<[number, number]>;
}

class DQNAgent {
    private model: tf.Sequential;
    private targetModel: tf.Sequential;
    private memory: Array<{
        state: GameState,
        action: number,
        reward: number,
        nextState: GameState,
        done: boolean
    }> = [];
    private epsilon: number = EPSILON_START;

    constructor() {
        this.model = this.buildModel();
        this.targetModel = this.buildModel();
        this.updateTargetModel();
    }

    private buildModel(): tf.Sequential {
        const model = tf.sequential();
        
        // Input layers for each state component
        const agentPositionInput = tf.input({shape: [2]});
        const itemsInput = tf.input({shape: [NUM_ITEMS, 2]});
        const enemiesInput = tf.input({shape: [NUM_ENEMIES, 2]});
        
        // Process each input separately
        const agentPositionProcessed = tf.layers.dense({
            units: 16,
            activation: 'relu'
        }).apply(agentPositionInput) as tf.SymbolicTensor;
        
        const itemsFlattened = tf.layers.flatten().apply(itemsInput) as tf.SymbolicTensor;
        const itemsProcessed = tf.layers.dense({
            units: 32,
            activation: 'relu'
        }).apply(itemsFlattened) as tf.SymbolicTensor;
        
        const enemiesFlattened = tf.layers.flatten().apply(enemiesInput) as tf.SymbolicTensor;
        const enemiesProcessed = tf.layers.dense({
            units: 32,
            activation: 'relu'
        }).apply(enemiesFlattened) as tf.SymbolicTensor;
        
        // Concatenate all processed inputs
        const merged = tf.layers.concatenate().apply([
            agentPositionProcessed,
            itemsProcessed,
            enemiesProcessed
        ]) as tf.SymbolicTensor;
        
        // Hidden layers
        const hidden1 = tf.layers.dense({
            units: 64,
            activation: 'relu'
        }).apply(merged) as tf.SymbolicTensor;
        
        const hidden2 = tf.layers.dense({
            units: 32,
            activation: 'relu'
        }).apply(hidden1) as tf.SymbolicTensor;
        
        // Output layer
        const output = tf.layers.dense({
            units: NUM_ACTIONS,
            activation: 'linear'
        }).apply(hidden2) as tf.SymbolicTensor;
        
        // Create model
        model.add(tf.layers.inputLayer({inputShape: [2]}));
        model.add(tf.layers.dense({units: 16, activation: 'relu'}));
        
        // Final model
        model.compile({
            optimizer: tf.train.adam(LEARNING_RATE),
            loss: 'meanSquaredError'
        });
        
        // Simplified version since tf.Sequential doesn't easily support multiple inputs
        // In practice, you might want to use tf.LayersModel instead for complex inputs
        const simpleModel = tf.sequential();
        simpleModel.add(tf.layers.dense({
            units: 64,
            inputShape: [2 + NUM_ITEMS * 2 + NUM_ENEMIES * 2],
            activation: 'relu'
        }));
        simpleModel.add(tf.layers.dense({
            units: 32,
            activation: 'relu'
        }));
        simpleModel.add(tf.layers.dense({
            units: NUM_ACTIONS,
            activation: 'linear'
        }));
        simpleModel.compile({
            optimizer: tf.train.adam(LEARNING_RATE),
            loss: 'meanSquaredError'
        });
        
        return simpleModel;
    }

    public updateTargetModel(): void {
        this.targetModel.setWeights(this.model.getWeights());
    }

    private stateToTensor(state: GameState): tf.Tensor {
        // Flatten all state arrays into a single tensor
        const flatState = [
            ...state.agentPosition,
            ...state.items.flat(),
            ...state.enemies.flat()
        ];
        return tf.tensor2d([flatState]);
    }

    public act(state: GameState): number {
        if (Math.random() < this.epsilon) {
            return Math.floor(Math.random() * NUM_ACTIONS);
        }
        return tf.tidy(() => {
            const stateTensor = this.stateToTensor(state);
            const qValues = this.model.predict(stateTensor) as tf.Tensor;
            const action = qValues.argMax(1).dataSync()[0];
            return action;
        });
    }

    public remember(
        state: GameState,
        action: number,
        reward: number,
        nextState: GameState,
        done: boolean
    ): void {
        this.memory.push({ state, action, reward, nextState, done });
        if (this.memory.length > MEMORY_CAPACITY) {
            this.memory.shift();
        }
    }

    public async replay(): Promise<void> {
        if (this.memory.length < BATCH_SIZE) {
            return;
        }

        // Sample a batch from memory
        const batch = [];
        for (let i = 0; i < BATCH_SIZE; i++) {
            const randomIndex = Math.floor(Math.random() * this.memory.length);
            batch.push(this.memory[randomIndex]);
        }

        // Prepare inputs and targets
        const states = batch.map(exp => exp.state);
        const nextStates = batch.map(exp => exp.nextState);

        const stateTensors = tf.stack(states.map(s => this.stateToTensor(s).squeeze()));
        const nextStateTensors = tf.stack(nextStates.map(s => this.stateToTensor(s).squeeze()));

        const currentQs = (await( this.model.predict(stateTensors) as tf.Tensor).array()) as number[][];
        const nextQs = (await (this.targetModel.predict(nextStateTensors) as tf.Tensor).array()) as number[][];

        const inputs: number[][] = [];
        const targets: number[][] = [];

        batch.forEach((experience, i) => {
            const { state, action, reward, done } = experience;
            
            const target = [...currentQs[i]];
            if (done) {
                target[action] = reward;
            } else {
                target[action] = reward + DISCOUNT_FACTOR * Math.max(...nextQs[i]);
            }

            inputs.push([
                ...state.agentPosition,
                ...state.items.flat(),
                ...state.enemies.flat()
            ]);
            targets.push(target);
        });

        // Train the model
        await this.model.fit(
            tf.tensor2d(inputs),
            tf.tensor2d(targets),
            { batchSize: BATCH_SIZE, epochs: 1, verbose: 0 }
        );

        // Decay epsilon
        if (this.epsilon > EPSILON_END) {
            this.epsilon *= EPSILON_DECAY;
        }
    }
}

class GridWorldEnvironment {
    private state: GameState;

    constructor() {
        this.state = this.generateRandomState();
    }

    private generateRandomState(): GameState {
        const positions: Set<string> = new Set();
        
        // Generate unique positions
        const getUniquePosition = (): [number, number] => {
            let pos: [number, number];
            do {
                pos = [
                    Math.floor(Math.random() * GRID_SIZE),
                    Math.floor(Math.random() * GRID_SIZE)
                ];
            } while (positions.has(pos.join(',')));
            positions.add(pos.join(','));
            return pos;
        };

        const agentPosition = getUniquePosition();
        const items: Array<[number, number]> = [];
        const enemies: Array<[number, number]> = [];

        for (let i = 0; i < NUM_ITEMS; i++) {
            items.push(getUniquePosition());
        }

        for (let i = 0; i < NUM_ENEMIES; i++) {
            enemies.push(getUniquePosition());
        }

        return { agentPosition, items, enemies };
    }

    reset(): GameState {
        this.state = this.generateRandomState();
        return { ...this.state };
    }

    step(action: number): { state: GameState, reward: number, done: boolean } {
        const newAgentPosition: [number, number] = [...this.state.agentPosition];
        
        // Move agent based on action
        switch (action) {
            case 0: newAgentPosition[1] = Math.max(0, newAgentPosition[1] - 1); break; // Up
            case 1: newAgentPosition[1] = Math.min(GRID_SIZE - 1, newAgentPosition[1] + 1); break; // Down
            case 2: newAgentPosition[0] = Math.max(0, newAgentPosition[0] - 1); break; // Left
            case 3: newAgentPosition[0] = Math.min(GRID_SIZE - 1, newAgentPosition[0] + 1); break; // Right
        }

        // Check for collisions with items
        let reward = -0.1; // Small penalty for each step to encourage efficiency
        const remainingItems = this.state.items.filter(item => {
            const isCollected = item[0] === newAgentPosition[0] && item[1] === newAgentPosition[1];
            if (isCollected) reward += 10; // Big reward for collecting item
            return !isCollected;
        });

        // Check for collisions with enemies
        let done = false;
        const hitEnemy = this.state.enemies.some(enemy => 
            enemy[0] === newAgentPosition[0] && enemy[1] === newAgentPosition[1]
        );
        
        if (hitEnemy) {
            reward = -20; // Big penalty for hitting enemy
            done = true;
        }

        // Check if all items collected
        if (remainingItems.length === 0) {
            reward = 20; // Big reward for collecting all items
            done = true;
        }

        // Update state
        this.state = {
            agentPosition: newAgentPosition,
            items: remainingItems,
            enemies: this.state.enemies
        };

        return {
            state: { ...this.state },
            reward,
            done
        };
    }
}

async function trainAgent() {
    const agent = new DQNAgent();
    const env = new GridWorldEnvironment();

    for (let episode = 0; episode < EPISODES; episode++) {
        let state = env.reset();
        let totalReward = 0;
        let steps = 0;

        for (; steps < MAX_STEPS_PER_EPISODE; steps++) {
            const action = agent.act(state);
            const { state: nextState, reward, done } = env.step(action);
            
            agent.remember(state, action, reward, nextState, done);
            await agent.replay();

            state = nextState;
            totalReward += reward;

            if (done) {
                break;
            }
        }

        // Update target network periodically
        if (episode % 10 === 0) {
            agent.updateTargetModel();
        }

        console.log(`Episode ${episode}, Steps: ${steps}, Total Reward: ${totalReward.toFixed(1)}, Epsilon: ${agent['epsilon'].toFixed(3)}`);
    }

    console.log('Training complete!');
    return agent;
}

// Run the training
trainAgent().then(agent => {
    console.log('Agent trained successfully!');
    
    // Test the trained agent
    const env = new GridWorldEnvironment();
    const testEpisodes = 5;
    
    for (let i = 0; i < testEpisodes; i++) {
        let state = env.reset();
        let done = false;
        let steps = 0;
        console.log(`\nTest Episode ${i + 1}`);
        console.log(`Start State: Agent at [${state.agentPosition}], Items at ${state.items}, Enemies at ${state.enemies}`);
        
        while (!done && steps < 50) {
            const action = agent.act(state);
            const { state: nextState, reward, done: episodeDone } = env.step(action);
            console.log(`Step ${steps}: Action ${['Up', 'Down', 'Left', 'Right'][action]}, Reward ${reward}`);
            state = nextState;
            done = episodeDone;
            steps++;
        }
        
        console.log(`Final State: Agent at [${state.agentPosition}], Items left: ${state.items.length}`);
    }
}).catch(err => {
    console.error('Training failed:', err);
});