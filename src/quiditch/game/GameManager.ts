import { IZone } from "../../engine/ai/zone/IZone";
import { RectZone } from "../../engine/ai/zone/RectZone";
import { IActor } from "../../engine/base/Actor/IActor";
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

export class GameManager{
    private readonly _sceneManager:SceneManager;
    private readonly _teams:Team[]=[];

    private readonly _quiditchFactory:IQuiditchFactory<IActor>;

    private readonly _onInit?:()=>void;

    private _playerChaser?: Chaser;
    private _chasers:Chaser[]=[];

    constructor(sceneManager:SceneManager, quiditchFactory:IQuiditchFactory<IActor>, onInit?:()=>void){
        this._sceneManager = sceneManager;
        this._quiditchFactory = quiditchFactory;
        this._onInit = onInit;
        this._init();
    }

    private async _init(){
        this._teams.push(await this._createQuiditchTeam(70,true));
        this._teams.push(await this._createQuiditchTeam(70,false));
        this._playerChaser = this._chasers[0];
        if (this._onInit) {
            this._onInit();
        }

    }
    public async getEnemyGates(player:IActor):Promise<Gates[]>{
        const playerTeam = this._getActorTeam(player);
        let result:Gates[] = [];
        if(playerTeam){
            const gates:Gates[] = await this._sceneManager.getActorsByName(ActorNames.gates) as Gates[];
            result = gates.filter(g=>this._getActorTeam(g)&&this._getActorTeam(g)!==playerTeam);
        }
        return result;
    }

    public async getClosestTarget(source:IActor, targets:IActor[], zone?:IZone<Vector2d>){
        return await this._sceneManager.getClosestActor(await source.getPosition(),targets,zone);
    }
    private _getActorTeam(actor:IActor):Team|undefined{
            return this._teams.find(t=>t.isActorInTeam(actor));
    }

    public async getQuaffle():Promise<Quaffle | undefined>{
        const quaffles =await this._sceneManager.getActorsByName(ActorNames.quaffle);
        return quaffles.length>0?quaffles[0] as Quaffle:undefined;        
    }

    private async _createQuiditchTeam(fieldRadius:number, isLeft:boolean):Promise<Team>{
        const team = new Team(isLeft?"left":"right");
        for(let i = 0; i<3;i++){
            const gates = await this._createGates();
            await gates.setPosition(isLeft?-fieldRadius*0.8:fieldRadius*0.8,(i-1)*fieldRadius*0.1);
            await gates.setRotation(isLeft?-Math.PI/2:Math.PI/2);
            team.AddMember(gates);
        }
        for (let i = 0; i < 3; i++) {

            const zone = new RectZone(new Vector2d(
                isLeft ? (-i - 1) * fieldRadius / 3 : i * fieldRadius / 3, fieldRadius), new Vector2d(
                    isLeft ? -i * fieldRadius / 3 : (i + 1) * fieldRadius / 3, -fieldRadius
                )
            );
            const chaser = await this._createChaser(zone);
            this._chasers.push(chaser);
            const player = await chaser.getActor();
            if (player) {
                team.AddMember(player);
                const pos = await zone.getRandomPoint();
                await player?.setPosition(pos.x, pos.y);
            }
        }
        return team;
    }
    private async _createGates():Promise<IActor>{
        const gates = await this._quiditchFactory.createGates(2);
        this._sceneManager.addTickable(gates);
        return gates;
    }

    private async _createChaser(zone: RectZone): Promise<Chaser> {

        const player = await this._quiditchFactory.createPlayer();
        await player.setSpeed(await player.getSpeed() * 0.5);
        await player.setRotationSpeed(await player.getRotationSpeed() * 0.5);
        this._sceneManager.addTickable(player);

        const playerController = new QuiditchPlayerController(player); //actor controller
        this._sceneManager.addTickable(playerController);

        const targetPointInputController = new TargetPointInputController(playerController);
        this._sceneManager.addTickable(targetPointInputController);


        const chaser = new Chaser(zone, targetPointInputController, 1, this); //ai
        this._sceneManager.addTickable(chaser);
        
        return chaser;

    }
    public async getPlayerChaser(): Promise<Chaser | undefined> {
       return this._playerChaser;
    }

}