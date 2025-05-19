import { BaseState } from "@common/BaseState"
import { MatchState } from "../../common/MatchState"
import { IActor } from "@common/IActor";
import { Vector2d } from "@common/Vector2d";
import { ActorNames } from "../../common/constants";
import { IQuiditchFactory } from "../../common/IQuiditchActorFactory";
import { Gates } from "../factory/components/Gates";
import { PlayerActor } from "../factory/components/PlayerActor";
import { Quaffle } from "../factory/components/balls/Quaffle";
import { Chaser } from "../ai/Chaser";
import { QuiditchPlayerController } from "../controls/QuiditchPlayerController";
import { TargetPointInputController } from "../controls/TargetPointInputController";
import { CircleZone } from "../../../engine/server/ai/zone/CircleZone";
import { IZone } from "../../../engine/server/ai/zone/IZone";
import { Team } from "../../../engine/server/game/Team";
import { Score } from "../../common/Score";
import { IPhysicsManager } from "../../../engine/server/base/IPhysicsManager";
import { BaseGameManager } from "../../../engine/server/game/BaseGameManager";
import { PlayerState } from "../../common/PlayerState";
import { ActorState } from "@common/ActorState";


export class QuiditchGameManager extends BaseGameManager {
    private readonly _quiditchFactory: IQuiditchFactory<IActor>;

    private _chasers: Chaser[] = [];
    private _hideQuaffle: boolean = false;
    private readonly _goalHandlers: ((team: Team) => void)[] = [];

    private _playerChasers: {
        playerId: string,
        chaser: Chaser
    }[] = [];

    public addOnGoalHandler(handler: (team: Team) => void) {
        this._goalHandlers.push(handler);
    }
    debounce(callback: any, wait: number, context: object) {
        let timeoutId: NodeJS.Timeout;
        return (...args: any) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callback.apply(context, ...args);
            }, wait);
        };
    }
    constructor(quiditchFactory: IQuiditchFactory<IActor>, physicsManager: IPhysicsManager) {
        super(physicsManager);
        this._quiditchFactory = quiditchFactory;


    }

    public getStates(): BaseState[] {
        // this._debouncePause();
        return [...super.getStates(), this._getMatchState()];
    }


    private _getMatchState(): MatchState {
        const matchState = new MatchState();
        matchState.score = this._score;
        matchState.paused = this.getPause();
        matchState.time = this._elapsedTime;
        return matchState;
    }

    private _score: Score = {};
    public async init(states?: BaseState[]): Promise<void> {



        this._teams.push(await this._createQuiditchTeam(70, true, states));
        this._teams.push(await this._createQuiditchTeam(70, false, states));
        for (const team of this._teams) {
            this._score[team.getId()] = 0;
        }
        const setScore = (team?: Team) => {

            if (team) {
                const teamId = team.getId();
                this._score[teamId]++;
            }
        }

        if (states) {
            const matchState = states.filter(s => s.name === "match")[0] as MatchState;
            if (matchState) {
                this._score = matchState.score;
            }
        }
        this.addOnGoalHandler(setScore);

        const walls = await this._quiditchFactory.createWalls();
        this.addTickable(walls);
        //this._stateWatchActors.push(walls);
        setTimeout(async () => {
            const ball = await this._quiditchFactory.createQuaffle();
            ball.setPosition(0, 0);
            if (states) {
                const quaffleState = states.filter(s => s.name === ActorNames.quaffle)[0] as ActorState;
                if (quaffleState) {
                    ball.setState(quaffleState);
                }
            }
            this._stateWatchActors.push(ball);
            this.addTickable(ball);
        }, 2000)

        this.addOnGoalHandler((team: Team) => this._onGoal());

        this._debouncePause();
    }
    private _debouncePause = this.debounce(() => this.setPause(true), 5000, this);
    private async _onGoal(): Promise<void> {
        const quaffle = await this.getQuaffle();
        this.setHideQuaffle(true);

        this._playerChasers.forEach(p => p.chaser?.setIsControlled(false, p.playerId));

        await quaffle?.setPosition(75, 0);
        setTimeout(async () => {

            await quaffle?.setPosition(0, 0);
            this._playerChasers.forEach(p => p.chaser?.setIsControlled(true, p.playerId));
            this.setHideQuaffle(false);
        }, 10000)
    }

    public async initQuaffleEnvironment(clientId: string): Promise<void> {

        const walls = await this._quiditchFactory.createWalls();
        this.addTickable(walls);
        const ball = await this._quiditchFactory.createQuaffle();
        
         const angle = Math.random() * Math.PI * 2;
  
  // Random radius (this approach creates non-uniform distribution)
  const r = Math.random() * 70;
  
  // Convert polar to Cartesian coordinates
  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);
  ball.setPosition(x, y);
  
        this._stateWatchActors.push(ball);
        this.addTickable(ball);
        const zone = new CircleZone(70, new Vector2d(0, 0));
        let pos = new Vector2d(-30, 0);
        const chaser = await this._createChaser(zone, true, pos);
        this._chasers.push(chaser);
        this.setPlayerChaser(chaser, clientId);
    }

    setPlayerChaser(chaser: Chaser, playerId: string) {
        const prevChaser = this._playerChasers.filter(p => p.playerId === playerId)[0];
        if (prevChaser) {
            const prevActor = prevChaser.chaser.getActor();
            if (prevActor) {
                prevActor?.setSpeed(prevActor.getSpeed() * 0.5);
            }

            prevChaser.chaser.setIsControlled(false);
            this._playerChasers.splice(this._playerChasers.indexOf(prevChaser), 1);
        }
        this._playerChasers.push({ chaser, playerId });
        const newActor = chaser.getActor();
        newActor?.setSpeed(newActor.getSpeed() * 2);
        chaser.setIsControlled(true, playerId);

    }

    getChaserByPlayerId(id: string): Chaser | undefined {
        return this._playerChasers.filter(c => c.playerId === id)[0]?.chaser;
    }

    public async getEnemyGates(player: IActor): Promise<Gates[]> {
        const playerTeam = this.getActorTeam(player);
        let result: Gates[] = [];
        if (playerTeam) {
            const gates: Gates[] = await this.getActorsByName(ActorNames.gates) as Gates[];
            result = gates.filter(g => this.getActorTeam(g) && this.getActorTeam(g) !== playerTeam);
        }
        return result;
    }

    public async getTeamByPlayer(player: IActor): Promise<PlayerActor[]> {
        const playerTeam = this.getActorTeam(player);
        let result: PlayerActor[] = [];
        if (playerTeam) {
            const players: PlayerActor[] = await this.getActorsByName(ActorNames.player) as PlayerActor[];
            result = players.filter(p => this.getActorTeam(p) && this.getActorTeam(p) === playerTeam);
        }
        return result;
    }


    public async getQuaffle(): Promise<Quaffle | undefined> {
        if (!this._hideQuaffle) {
            const quaffles = await this.getActorsByName(ActorNames.quaffle);
            return quaffles.length > 0 ? quaffles[0] as Quaffle : undefined;
        }
    }

    private async _createQuiditchTeam(fieldRadius: number, isLeft: boolean, states?: BaseState[]): Promise<Team> {
        const usedStates: BaseState[] = [];
        return new Promise(async (res, rej) => {
            const team = new Team(isLeft ? "red" : "blue");
            for (let i = 0; i < 3; i++) {
                const gates = await this._createGates();

                await gates.setPosition(isLeft ? -fieldRadius * 0.8 : fieldRadius * 0.8, (i - 1) * fieldRadius * 0.1);
                await gates.setRotation(isLeft ? -Math.PI / 2 : Math.PI / 2);
                this.addTickable(gates);
                team.AddMember(gates);
            }
            setTimeout(async () => {
                const zone = new CircleZone(70, new Vector2d(0, 0));
                for (let i = 0; i < 3; i++) {

                    // const zone = new RectZone(new Vector2d(
                    //     isLeft ? (-i - 1) * fieldRadius / 3 : i * fieldRadius / 3, fieldRadius), new Vector2d(
                    //         isLeft ? -i * fieldRadius / 3 : (i + 1) * fieldRadius / 3, -fieldRadius
                    //     )
                    // );

                    let pos = new Vector2d(isLeft ? -30 : 30, (i - 1) * 30);


                    const chaser = await this._createChaser(zone, isLeft, pos);
                    if (states) {
                        const color = isLeft ? "red" : "blue";
                        const playerState: PlayerState = states.filter(s => s.name === "player")
                            .filter(s => (s as PlayerState).color === color
                                && !usedStates.includes(s))[0] as PlayerState;
                        if (playerState) {
                            usedStates.push(playerState);
                            await chaser.getActor()?.setState(playerState);
                        }
                    }

                    this._chasers.push(chaser);

                    const player = await chaser.getActor();
                    if (player) {
                        team.AddMember(player);
                    }
                }
                return res(team);
            }, 200)

        })

    }
    private async _createGates(): Promise<IActor> {
        const gates = await this._quiditchFactory.createGates(2) as Gates;
        this._stateWatchActors.push(gates);
        gates.setOnGoal(async () => {
            const team = await this.getActorTeam(gates);
            if (team) {
                for (const handler of this._goalHandlers) {
                    handler(team);
                }
            }

            const quaffle = await this.getQuaffle();
            //quaffle?.setSpeed(0);
            this.setHideQuaffle(true);

            this._playerChasers.forEach(p => p.chaser?.setIsControlled(false, p.playerId));

            await quaffle?.setPosition(75, 0);
            setTimeout(async () => {

                await quaffle?.setPosition(0, 0);
                this._playerChasers.forEach(p => p.chaser?.setIsControlled(true, p.playerId));
                this.setHideQuaffle(false);
            }, 3000)

        });
        return gates;
    }


    setHideQuaffle(arg0: boolean) {
        this._hideQuaffle = arg0;
    }

    private async _createChaser(zone: IZone<Vector2d>, isLeft: boolean, initialPos: Vector2d): Promise<Chaser> {

        const player = await this._quiditchFactory.createPlayer(isLeft ? "red" : "blue");
        await player.setSpeed(await player.getSpeed() * 0.5);
        await player.setRotationSpeed(await player.getRotationSpeed() * 0.5);
        this.addTickable(player);
        this._stateWatchActors.push(player);
        const playerController = new QuiditchPlayerController(player); //actor controller
        this.addTickable(playerController);

        const targetPointInputController = new TargetPointInputController(playerController);
        this.addTickable(targetPointInputController);


        const chaser = new Chaser(zone, targetPointInputController, 0.2, this); //ai
        await player.setPosition(initialPos.x, initialPos.y);

        chaser.setInitialPos(initialPos);
        this.addTickable(chaser);

        return chaser;

    }



    public getChasers(): Chaser[] {
        return [...this._chasers];

    }
}