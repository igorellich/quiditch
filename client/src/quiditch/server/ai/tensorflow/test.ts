import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import { IEnvironment } from './IEnvironment';

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



class DQNAgent<TGameState> {
    private model: tf.Sequential;
    private targetModel: tf.Sequential;
    private readonly _environment: IEnvironment<TGameState>;
    private memory: Array<{
        state: TGameState,
        action: number,
        reward: number,
        nextState: TGameState,
        done: boolean
    }> = [];
    private epsilon: number = EPSILON_START;

    constructor(environment: IEnvironment<TGameState>) {
        this._environment = environment;
        this.model = this.buildModel();
        this.targetModel = this.buildModel();
        this.updateTargetModel();
    }

    private buildModel(): tf.Sequential {
        const model = tf.sequential();

        // Input layers for each state component
        //const agentPositionInput = tf.input({ shape: [2] });
        const itemsInput = tf.input({ shape: [this._environment.getStateShape()] });
        //const enemiesInput = tf.input({ shape: [NUM_ENEMIES, 2] });

        // Process each input separately
        // const agentPositionProcessed = tf.layers.dense({
        //     units: 16,
        //     activation: 'relu'
        // }).apply(agentPositionInput) as tf.SymbolicTensor;

        const itemsFlattened = tf.layers.flatten().apply(itemsInput) as tf.SymbolicTensor;
        const itemsProcessed = tf.layers.dense({
            units: 32,
            activation: 'relu'
        }).apply(itemsFlattened) as tf.SymbolicTensor;

        // const enemiesFlattened = tf.layers.flatten().apply(enemiesInput) as tf.SymbolicTensor;
        // const enemiesProcessed = tf.layers.dense({
        //     units: 32,
        //     activation: 'relu'
        // }).apply(enemiesFlattened) as tf.SymbolicTensor;

        // Concatenate all processed inputs
        const merged = tf.layers.concatenate().apply([
            //agentPositionProcessed,
            itemsProcessed,
           // enemiesProcessed
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
            units: this._environment.getActionsCount(),
            activation: 'linear'
        }).apply(hidden2) as tf.SymbolicTensor;

        // Create model
        model.add(tf.layers.inputLayer({ inputShape: [2] }));
        model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

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
            inputShape: [this._environment.getStateShape()],
            activation: 'relu'
        }));
        simpleModel.add(tf.layers.dense({
            units: 32,
            activation: 'relu'
        }));
        simpleModel.add(tf.layers.dense({
            units: this._environment.getActionsCount(),
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

    private async stateToTensor(state: TGameState): Promise<tf.Tensor> {
        // Flatten all state arrays into a single tensor
        const flatState = await this._environment.getFlatState(state);
        return tf.tensor2d([flatState]);
    }

    public async  act(state: TGameState): Promise<number> {
        if (Math.random() < this.epsilon) {
            return Math.floor(Math.random() * this._environment.getActionsCount());
        }
        const stateTensor = await this.stateToTensor(state);
        return tf.tidy(() => {
            
            const qValues = this.model.predict(stateTensor) as tf.Tensor;
            const action = qValues.argMax(1).dataSync()[0];
            stateTensor.dispose();
            return action;
        });
    }

    public remember(
        state: TGameState,
        action: number,
        reward: number,
        nextState: TGameState,
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

        const stateTensors = tf.stack(await Promise.all(states.map(async s => (await this.stateToTensor(s)).squeeze())));
        const nextStateTensors = tf.stack(await Promise.all(nextStates.map(async s =>(await this.stateToTensor(s)).squeeze())));

        const currentQs = (await (this.model.predict(stateTensors) as tf.Tensor).array()) as number[][];
        const nextQs = (await (this.targetModel.predict(nextStateTensors) as tf.Tensor).array()) as number[][];

        const inputs: number[][] = [];
        const targets: number[][] = [];

        for(let i = 0; i<batch.length; i++) {
            const experience = batch[i];
              const { state, action, reward, done } = experience;

            const target = [...currentQs[i]];
            if (done) {
                target[action] = reward;
            } else {
                target[action] = reward + DISCOUNT_FACTOR * Math.max(...nextQs[i]);
            }
            const flatState = await this._environment.getFlatState(state);
            inputs.push(flatState);
            targets.push(target);
        }
    

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




export class AgentManager<TGameState> {
    constructor(env: IEnvironment<TGameState>) {
        // Run the training
        this.trainAgent(env).then(async agent => {
            console.log('Agent trained successfully!');

            // Test the trained agent

            const testEpisodes = 5;

            for (let i = 0; i < testEpisodes; i++) {
                let state:TGameState = await env.reset();
                let done = false;
                let steps = 0;
                console.log(`\nTest Episode ${i + 1}`);
                // console.log(`Start State: Agent at [${state.agentPosition}], Items at ${state.items}, Enemies at ${state.enemies}`);

                while (!done && steps < 50) {
                    const action = await agent.act(state);
                    const { state: nextState, reward, done: episodeDone } = await env.step(action);
                    console.log(`Step ${steps}: Action ${['Up', 'Down', 'Left', 'Right'][action]}, Reward ${reward}`);
                    state = nextState;
                    done = episodeDone;
                    steps++;
                }

                // console.log(`Final State: Agent at [${state.agentPosition}], Items left: ${state.items.length}`);
            }
        }).catch(err => {
            console.error('Training failed:', err);
        });
    }


    async trainAgent<TGameState>(env: IEnvironment<TGameState>) {
        const agent = new DQNAgent(env);


        for (let episode = 0; episode < EPISODES; episode++) {
            let state: TGameState = await env.reset();
            let totalReward = 0;
            let steps = 0;

            for (; steps < MAX_STEPS_PER_EPISODE; steps++) {
                const action = await agent.act(state);
                const { state: nextState, reward, done } = await env.step(action);

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


}

