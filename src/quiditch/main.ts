import { World } from "@dimforge/rapier2d";
import * as nipplejs from "nipplejs";
import {Scene} from "three";
import { RapierBodyFactory } from "./factory/MB/three-rapier/RapierBodyFactory";
import { MBQuiditchFactory } from "./factory/MB/MBQuiditchActorFactory";
import { ThreeMeshFactory } from "./factory/MB/three-rapier/ThreeMeshFactory";
import { ThreeSceneManager } from "../engine/MB/three/ThreeSceneManager";
import { KeyboardInputController } from "../engine/controls/KeyboardInput";
import { QuiditchPlayerController } from "./QuiditchPlayerController";
import { RapierPhysicsManager } from "../engine/MB/rapier/RapierPhysicsManager";
import { RapierDebugRenderer } from "../utils/debugRenderer";
import { TargetPointInputController } from "./controls/TargetPointInputController";
import { Vector2d } from "../engine/base/Vector2d";
import { ThreeStats } from "../utils/threeStats";
import { RectZone } from "../engine/ai/zone/RectZone";
import { Chaser } from "./ai/Chaser";


const attackButton = document.createElement("div");
attackButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    targetPointInputController.attack();
})
attackButton.className="attack";
document.body.appendChild(attackButton)

const goalsCounter = document.createElement("div");
goalsCounter.className="goals";
document.body.appendChild(goalsCounter);
const stickZone = document.createElement("div");
stickZone.className="stickZone";
document.body.appendChild(stickZone)


//@ts-ignore
const joy = nipplejs.default.create({
    mode:"semi",
    catchDistance:150,
    zone:document.querySelector(".stickZone")

});

(joy as nipplejs.Joystick).on("move",async (evt, data)=>{
    const playerPos = await player.getPosition();
    targetPointInputController.setTargetPoint(new Vector2d(playerPos.x+data.vector.x*1000, playerPos.y+data.vector.y*1000));
});

(joy as nipplejs.Joystick).on("end",async (evt, data)=>{
    targetPointInputController.setTargetPoint(undefined);
});


let gravity = { x: 0.0, y: 0.0 };
let world = new World(gravity);
const scene = new Scene();



const canvas = document.querySelector("#app") as HTMLCanvasElement;
const physicsManager = new RapierPhysicsManager(world);
const sceneManager = new ThreeSceneManager({ height: window.innerHeight, width: window.innerWidth }, canvas, scene, physicsManager);
const bodyFactory = new RapierBodyFactory(world);
const meshFactory = new ThreeMeshFactory(sceneManager, 5);
const quiditchFactory = new MBQuiditchFactory(bodyFactory, meshFactory,sceneManager);

//3d models
const player = await quiditchFactory.createPlayer();

sceneManager.setCameraTarget(player);

sceneManager.addTickable(player);




const ball = await quiditchFactory.createBall();
ball.setPosition(0,4);
sceneManager.addTickable(ball);

const poiner = await quiditchFactory.createPointer(ball, player);
sceneManager.addTickable(poiner);

const plane = await quiditchFactory.createGround();
sceneManager.addTickable(plane);

const walls = await quiditchFactory.createWalls();
sceneManager.addTickable(walls);

const gates = await quiditchFactory.createGates(2);
sceneManager.addTickable(gates);
gates.setPosition(0,10);

// Controls
const quiditchPlayerController = new QuiditchPlayerController(player);
sceneManager.addTickable(quiditchPlayerController);

const targetPointInputController = new TargetPointInputController(player);
sceneManager.addTickable(targetPointInputController);
quiditchPlayerController.addInputController(targetPointInputController);

const keyboardInputController = new KeyboardInputController({ attack: [" "], moveBackward: ["s"], moveForward: ["w"], turnLeft: ["a"], turnRight: ["d"] });
quiditchPlayerController.addInputController(keyboardInputController);

sceneManager.startTime();

const debugRenderer = new RapierDebugRenderer(scene, world, 5);
sceneManager.addTickable(debugRenderer);
const stats =new ThreeStats(document.body);
sceneManager.addTickable(stats);

//AI
const aiPlayer =  await quiditchFactory.createPlayer();
sceneManager.addTickable(aiPlayer);
const aiPlayerController = new QuiditchPlayerController(aiPlayer);
sceneManager.addTickable(aiPlayerController);

const aiTargetPointInputController = new TargetPointInputController(aiPlayer);
sceneManager.addTickable(aiTargetPointInputController);
aiPlayerController.addInputController(aiTargetPointInputController);

const zone = new RectZone(new Vector2d(-45,45),new Vector2d(45,-45));
    const patroller = new Chaser(zone,aiTargetPointInputController,1,sceneManager);
    sceneManager.addTickable(patroller);
    patroller.setPatrolling(true);
aiPlayer.setPosition(-6,-6);


// const targetMesh = new Mesh(new SphereGeometry(0.1,16,32), new MeshBasicMaterial({color:"red"}));
// scene.add(targetMesh)
// const targetPointGetter = (event)=>{
//     let result: Vector2d = null;
//     const rect = canvas.getBoundingClientRect();
//     const clientX = (event as MouseEvent).clientX||(event as TouchEvent).touches[0].clientX;
//     const clientY = (event as MouseEvent).clientY||(event as TouchEvent).touches[0].clientY;
//     let viewportDown = new Vector2();
//     viewportDown.x = (((clientX - rect.left) / rect.width) * 2) - 1;
//     viewportDown.y = - (((clientY - rect.top) / rect.height) * 2) + 1;

//     const mesh = ((plane as MeshBasedActor).getMesh() as ThreeBasedMesh).getMesh();
//     const rayCaster = new Raycaster();
//     rayCaster.setFromCamera(viewportDown, sceneManager.getCamera());
   
//     const intersectResult = rayCaster.intersectObject(mesh);
//     if (intersectResult.length > 0) {
//         result = new Vector2d(intersectResult[0].point.x, intersectResult[0].point.y);
//         targetMesh.position.set(intersectResult[0].point.x, intersectResult[0].point.y, 2);
        
//     }
//     return result;
// }
// document.addEventListener('click', (e) => {
            
//     targetInputController.setTargerPoint(targetPointGetter(e));
// })
// document.addEventListener('touchend', (e) => {
//     targetInputController.setTargerPoint(targetPointGetter(e));
// })

