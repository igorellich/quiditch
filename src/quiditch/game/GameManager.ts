import { CircleZone } from "../../engine/ai/zone/CircleZone";
import { IZone } from "../../engine/ai/zone/IZone";
import { IActor } from "../../engine/base/Actor/IActor";
import { ITickable } from "../../engine/base/ITickable";
import { SceneManager } from "../../engine/base/SceneManager";
import { Vector2d } from "../../engine/base/Vector2d";
import { Team } from "../../engine/game/Team";
import { Chaser } from "../ai/Chaser";
import { ActorNames } from "../constants";
import { QuiditchPlayerController } from "../controls/QuiditchPlayerController";
import { TargetPointInputController } from "../controls/TargetPointInputController";
import { IQuiditchFactory } from "../factory/IQuiditchActorFactory";
import { Quaffle } from "../factory/MB/components/balls/Quaffle";
import { Gates } from "../factory/MB/components/Gates";
import { PlayerActor } from "../factory/MB/components/PlayerActor";
import { StateSynchroniser } from "./StateSynchroniser";

export class GameManager implements ITickable{
    private readonly _sceneManager:SceneManager;
    private readonly _teams:Team[]=[];

    private readonly _quiditchFactory:IQuiditchFactory<IActor>;

    private readonly _onInit?:()=>void;

    private _playerChaser?: Chaser;
    private _chasers:Chaser[]=[];
    private _hideQuaffle: boolean = false;
    private readonly _goalHandlers:((team:Team)=>void)[] = [];

    
    private _stateWatchActors:IActor[]=[];

    public addOnGoalHandler(handler:(team:Team)=>void){
        this._goalHandlers.push(handler);
    }
    private readonly _stateSync:StateSynchroniser;
    constructor(sceneManager:SceneManager, quiditchFactory:IQuiditchFactory<IActor>, stateSync:StateSynchroniser, onInit?:()=>void){
        this._sceneManager = sceneManager;
        this._stateSync = stateSync;
        this._quiditchFactory = quiditchFactory;
        this._onInit = onInit;
        this._init();
        this._sceneManager.addTickable(this);
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        const newStates = await Promise.all(this._stateWatchActors.map(a=>a.getState()));
        this._stateSync.setStates(newStates);       
    }

    private async _init(){

      
        this._teams.push(await this._createQuiditchTeam(70,true));
        this._teams.push(await this._createQuiditchTeam(70,false));


        const ball = await this._quiditchFactory.createQuaffle();
        ball.setPosition(0, 0);
        this._stateWatchActors.push(ball);
        this._sceneManager.addTickable(ball);

        const walls = await this._quiditchFactory.createWalls();
        this._sceneManager.addTickable(walls);
        //this._stateWatchActors.push(walls);

        this.setPlayerChaser(this._chasers[0]);
        const player = this._chasers[0]?.getActor();
        const poiner = await this._quiditchFactory.createPointer(ball, player);
        this._sceneManager.addTickable(poiner);
      
        this.addOnGoalHandler((team:Team)=>this._onGoal());
        if (this._onInit) {
            this._onInit();
        }

    }

    private async _onGoal():Promise<void>{
        const quaffle = await this.getQuaffle();        
        this.setHideQuaffle(true);
        
         this._playerChaser?.setIsControlled(false);
         
         await quaffle?.setPosition(75,0);
         setTimeout(async ()=>{
             
             await quaffle?.setPosition(0,0);
             this._playerChaser?.setIsControlled(true);
             this.setHideQuaffle(false);
         },10000)
    }

    setPlayerChaser(chaser:Chaser){
        let actor = this._playerChaser?.getActor();
        if(this._playerChaser){
            
            actor?.setSpeed(actor.getSpeed()*0.5);
            this._playerChaser.setIsControlled(false);

        }
        this._playerChaser = chaser;
        actor = this._playerChaser.getActor();
        actor?.setSpeed(actor.getSpeed()*2);
        this._playerChaser.setIsControlled(true);
        
    }

    public async getEnemyGates(player:IActor):Promise<Gates[]>{
        const playerTeam = this.getActorTeam(player);
        let result:Gates[] = [];
        if(playerTeam){
            const gates:Gates[] = await this._sceneManager.getActorsByName(ActorNames.gates) as Gates[];
            result = gates.filter(g=>this.getActorTeam(g)&&this.getActorTeam(g)!==playerTeam);
        }
        return result;
    }

    public async getTeamByPlayer(player:IActor):Promise<PlayerActor[]>{
        const playerTeam = this.getActorTeam(player);
        let result:PlayerActor[] = [];
        if(playerTeam){
            const players:PlayerActor[] = await this._sceneManager.getActorsByName(ActorNames.player) as PlayerActor[];
            result = players.filter(p=>this.getActorTeam(p)&&this.getActorTeam(p)===playerTeam);
        }
        return result;
    }

    public async getClosestTarget(source:IActor, targets:IActor[], zone?:IZone<Vector2d>){
        return await this._sceneManager.getClosestActor(await source.getPosition(),targets,zone);
    }
    public getActorTeam(actor:IActor):Team|undefined{
            return this._teams.find(t=>t.isActorInTeam(actor));
    }

    public async getQuaffle(): Promise<Quaffle | undefined> {
        if (!this._hideQuaffle) {
            const quaffles = await this._sceneManager.getActorsByName(ActorNames.quaffle);
            return quaffles.length > 0 ? quaffles[0] as Quaffle : undefined;
        }
    }

    private async _createQuiditchTeam(fieldRadius:number, isLeft:boolean):Promise<Team>{
        return new Promise( async (res, rej)=>{
            const team = new Team(isLeft?"left":"right");
            for(let i = 0; i<3;i++){
                const gates = await this._createGates();
                
                await gates.setPosition(isLeft?-fieldRadius*0.8:fieldRadius*0.8,(i-1)*fieldRadius*0.1);
                await gates.setRotation(isLeft?-Math.PI/2:Math.PI/2);
                this._sceneManager.addTickable(gates);
                team.AddMember(gates);
            }
            setTimeout( async()=>{
                const zone  = new CircleZone(70,new Vector2d(0,0));
                for (let i = 0; i < 1; i++) {
        
                    // const zone = new RectZone(new Vector2d(
                    //     isLeft ? (-i - 1) * fieldRadius / 3 : i * fieldRadius / 3, fieldRadius), new Vector2d(
                    //         isLeft ? -i * fieldRadius / 3 : (i + 1) * fieldRadius / 3, -fieldRadius
                    //     )
                    // );
                    const pos = new Vector2d(isLeft ? -30 : 30, (i - 1) * 30);
                    const chaser = await this._createChaser(zone, isLeft, pos);
                    this._chasers.push(chaser);
                    const player = await chaser.getActor();
                    if (player) {
                        team.AddMember(player);
                        
                        
                        this._sceneManager.addTickable(player);
                    }
                }
                return res(team);
            },200)

        })
        
    }
    private async _createGates():Promise<IActor>{
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
           
            this._playerChaser?.setIsControlled(false);
            
            await quaffle?.setPosition(75,0);
            setTimeout(async ()=>{
                
                await quaffle?.setPosition(0,0);
                this._playerChaser?.setIsControlled(true);
                this.setHideQuaffle(false);
            },3000)
            
        });
        return gates;
    }


    setHideQuaffle(arg0: boolean) {
        this._hideQuaffle = arg0;
    }

    private async _createChaser(zone: IZone<Vector2d>, isLeft:boolean, initialPos:Vector2d): Promise<Chaser> {

        const player = await this._quiditchFactory.createPlayer(isLeft?"red":"blue");
        await player.setSpeed(await player.getSpeed() * 0.5);
        await player.setRotationSpeed(await player.getRotationSpeed() * 0.5);
        
        this._stateWatchActors.push(player);
        const playerController = new QuiditchPlayerController(player); //actor controller
        this._sceneManager.addTickable(playerController);

        const targetPointInputController = new TargetPointInputController(playerController);
        this._sceneManager.addTickable(targetPointInputController);


        const chaser = new Chaser(zone, targetPointInputController, 0.2, this); //ai
        await player.setPosition(initialPos.x, initialPos.y);
        chaser.setInitialPos(initialPos);
        this._sceneManager.addTickable(chaser);
        
        return chaser;

    }

    public getTeams():Team[]{
        return [...this._teams];
    }
    public async getPlayerChaser(): Promise<Chaser | undefined> {
       return this._playerChaser;
    }

   

}