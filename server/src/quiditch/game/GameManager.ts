import {ActorState} from "@common/engine/ActorState"
import {BaseState} from "@common/engine/BaseState"
import {MatchState} from "@common/quiditch/MatchState"
import { IActor } from "@common/engine/IActor";
import { ITickable } from "@common/engine/ITickable";
import { Vector2d } from "@common/engine/Vector2d";
import { ActorNames } from "@common/quiditch/constants";
import { IQuiditchFactory } from "@common/quiditch/IQuiditchActorFactory";
import { Gates } from "../factory/components/Gates";
import { PlayerActor } from "../factory/components/PlayerActor";
import { Quaffle } from "../factory/components/balls/Quaffle";
import { Chaser } from "../ai/Chaser";
import { QuiditchPlayerController } from "../controls/QuiditchPlayerController";
import { TargetPointInputController } from "../controls/TargetPointInputController";
import { CircleZone } from "src/engine/ai/zone/CircleZone";
import { IZone } from "src/engine/ai/zone/IZone";
import { Team } from "src/engine/game/Team";
import { Score } from "@common/quiditch/Score";


export class GameManager{    
    private readonly _teams:Team[]=[];

    private readonly _quiditchFactory:IQuiditchFactory<IActor>;

    private readonly _onInit?:()=>void;

    private readonly _tickers:ITickable[]=[];

  
    private _chasers:Chaser[]=[];
    private _hideQuaffle: boolean = false;
    private readonly _goalHandlers:((team:Team)=>void)[] = [];

    private _actorStates:ActorState[]=[];
    
    private _stateWatchActors:IActor[]=[];

    private _playerChasers:{
        playerId:string,
        chaser:Chaser
    }[]=[];

    public addOnGoalHandler(handler:(team:Team)=>void){
        this._goalHandlers.push(handler);
    }
    
    constructor(quiditchFactory:IQuiditchFactory<IActor>, onInit?:()=>void){
               
        this._quiditchFactory = quiditchFactory;
        this._onInit = onInit;
        this._init();        
    }

    public addTickable(tickable:ITickable){
        if(!this._tickers.includes(tickable)){
            this._tickers.push(tickable);
        }
        
    }


    public getStates():BaseState[]{
        return [...this._actorStates, this._getMatchState()];
    }

    private _getMatchState():MatchState{
        const matchState = new MatchState();
        matchState.score = this._score;
        return matchState;
    }
    private _tickInterval:any=0;
    private _score:Score={};
    private async _init(){

        
        this._teams.push(await this._createQuiditchTeam(70, true));
        this._teams.push(await this._createQuiditchTeam(70, false));
        for (const team of this._teams) {
            this._score[team.getId()] = 0;
        }
        const setScore = (team?: Team) => {
            
            if (team) {
                const teamId = team.getId();
                this._score[teamId]++;
            }
        }
        setScore();
        this.addOnGoalHandler(setScore);


        const walls = await this._quiditchFactory.createWalls();
        this.addTickable(walls);
        //this._stateWatchActors.push(walls);
        setTimeout(async ()=>{
            const ball = await this._quiditchFactory.createQuaffle();
            ball.setPosition(0, 0);
            this._stateWatchActors.push(ball);
            this.addTickable(ball);
            if (this._onInit) {
                this._onInit();
            }
        }, 2000)
       
      
        this.addOnGoalHandler((team:Team)=>this._onGoal());
        let elapsedTime = 0;
        const freq = (1/60)*1000;
        this._tickInterval = setInterval(async () => {
            elapsedTime += freq;
            for (const tickable of this._tickers) {
                tickable.tick(elapsedTime, freq);
            }
            const newStates = await Promise.all(this._stateWatchActors.map(a => a.getState()));
            this._actorStates = newStates;
        }, freq);

       

    }

    private async _onGoal():Promise<void>{
        const quaffle = await this.getQuaffle();        
        this.setHideQuaffle(true);
        
         this._playerChasers.forEach(p=>p.chaser?.setIsControlled(false,p.playerId));
         
         await quaffle?.setPosition(75,0);
         setTimeout(async ()=>{
             
             await quaffle?.setPosition(0,0);
             this._playerChasers.forEach(p=>p.chaser?.setIsControlled(true, p.playerId));
             this.setHideQuaffle(false);
         },10000)
    }

    setPlayerChaser(chaser:Chaser, playerId:string){
        const prevChaser = this._playerChasers.filter(p=>p.playerId===playerId)[0];
        if(prevChaser){
            const prevActor = prevChaser.chaser.getActor();
            if(prevActor){
                prevActor?.setSpeed(prevActor.getSpeed()*0.5);
            }
           
            prevChaser.chaser.setIsControlled(false);
            this._playerChasers.splice(this._playerChasers.indexOf(prevChaser),1);
        }
        this._playerChasers.push({chaser,playerId});
        const newActor = chaser.getActor();
        newActor?.setSpeed(newActor.getSpeed()*2);
        chaser.setIsControlled(true, playerId);
        
    }

    getChaserByPlayerId(id:string):Chaser|undefined{
        return this._playerChasers.filter(c=>c.playerId===id)[0]?.chaser;
    }

    public async getEnemyGates(player:IActor):Promise<Gates[]>{
        const playerTeam = this.getActorTeam(player);
        let result:Gates[] = [];
        if(playerTeam){
            const gates:Gates[] = await this.getActorsByName(ActorNames.gates) as Gates[];
            result = gates.filter(g=>this.getActorTeam(g)&&this.getActorTeam(g)!==playerTeam);
        }
        return result;
    }

    public async getTeamByPlayer(player:IActor):Promise<PlayerActor[]>{
        const playerTeam = this.getActorTeam(player);
        let result:PlayerActor[] = [];
        if(playerTeam){
            const players:PlayerActor[] = await this.getActorsByName(ActorNames.player) as PlayerActor[];
            result = players.filter(p=>this.getActorTeam(p)&&this.getActorTeam(p)===playerTeam);
        }
        return result;
    }

    public async getClosestTarget(source:IActor, targets:IActor[], zone?:IZone<Vector2d>){
        return await this.getClosestActor(await source.getPosition(),targets,zone);
    }
    public getActorTeam(actor:IActor):Team|undefined{
            return this._teams.find(t=>t.isActorInTeam(actor));
    }

    public async getQuaffle(): Promise<Quaffle | undefined> {
        if (!this._hideQuaffle) {
            const quaffles = await this.getActorsByName(ActorNames.quaffle);
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
                this.addTickable(gates);
                team.AddMember(gates);
            }
            setTimeout( async()=>{
                const zone  = new CircleZone(70,new Vector2d(0,0));
                for (let i = 0; i < 3; i++) {
        
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
                        
                        
                        this.addTickable(player);
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
           
            this._playerChasers.forEach(p=>p.chaser?.setIsControlled(false, p.playerId));
            
            await quaffle?.setPosition(75,0);
            setTimeout(async ()=>{
                
                await quaffle?.setPosition(0,0);
                this._playerChasers.forEach(p=>p.chaser?.setIsControlled(true, p.playerId));
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
        this.addTickable(playerController);

        const targetPointInputController = new TargetPointInputController(playerController);
        this.addTickable(targetPointInputController);


        const chaser = new Chaser(zone, targetPointInputController, 0.2, this); //ai
        await player.setPosition(initialPos.x, initialPos.y);
        chaser.setInitialPos(initialPos);
        this.addTickable(chaser);
        
        return chaser;

    }

    public getTeams():Team[]{
        return [...this._teams];
    }

    public getChasers():Chaser[]{
    return [...this._chasers];
    }

    public getActors(): IActor[] {
        return this._tickers.filter(t => {
            return (t as IActor).move;
        }) as IActor[];
    }
    public async getActorsByName(name: string): Promise<IActor[]> {
        const actors = await this.getActors();
        const result: IActor[] = [];
        for (const a of actors) {
            if ((await a.getName()) === name) {
                result.push(a);
            }
        }
        return result;
    }

    public async getClosestActor(sourcePos: Vector2d, targetActors: IActor[], zone?: IZone<Vector2d>): Promise<IActor | undefined> {
        let result: IActor | undefined;
        
        let fileredActors: IActor[] = [];
        if (zone) {
            for (const a of targetActors) {
                if (await zone.belongs(await a.getPosition())){
                    fileredActors.push(a);
                }
            }

        } else {
            fileredActors = targetActors;
        }
        let distance: number | undefined;
        for (let a of targetActors) {
            const currDist = await sourcePos.distanceTo(await a.getPosition());
            if (!distance || currDist < distance) {
                distance = currDist;
                result = a;
            }
        }
        return result;
    }

    public getTickers():ITickable[]{
        return [...this._tickers];
    }

}