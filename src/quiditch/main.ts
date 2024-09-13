import { World } from "@dimforge/rapier2d";
import { Mesh, MeshBasicMaterial, Raycaster, Scene, SphereGeometry, Vector2, Vector3 } from "three";
import { RapierBodyFactory } from "./MF/three-rapier/RapierBodyFactory";
import { MFQuiditchFactory } from "./MF/MFQuiditchActorFactory";
import { ThreeMeshFactory } from "./MF/three-rapier/ThreeMeshFactory";

import { ThreeSceneManager } from "../engine/MF/three/ThreeSceneManager";
import { InputController } from "../engine/controls/BaseInput";
import { KeyboardInputController } from "../engine/controls/KeyboardInput";
import { GameInputActions } from "./constants";
import { QuiditchPlayerController } from "./QuiditchPlayerController";
import { RapierPhysicsManager } from "../engine/MF/rapier/RapierPhysicsManager";
import { RapierDebugRenderer } from "../utils/debugRenderer";
import { MeshBasedActor } from "../engine/MF/three/MeshBasedActor";
import { ThreeBasedMesh } from "../engine/MF/three/ThreeBasedMesh";
import { MouseInputController } from "./controls/MouseInputController";
import { Vector2d } from "../engine/base/Vector2d";


let gravity = { x: 0.0, y: 0.0 };
let world = new World(gravity);
const scene = new Scene();

const inputController: InputController<GameInputActions> = new KeyboardInputController({ attack: [" "], moveBackward: ["s"], moveForward: ["w"], turnLeft: ["a"], turnRight: ["d"] });

const canvas = document.querySelector("#app") as HTMLCanvasElement;
const collisionManager = new RapierPhysicsManager(world);
const sceneManager = new ThreeSceneManager({ height: window.innerHeight, width: window.innerWidth }, canvas, scene, collisionManager);
const bodyFactory = new RapierBodyFactory(world);
const meshFactory = new ThreeMeshFactory(scene, 2);
const quiditchFactory = new MFQuiditchFactory(bodyFactory, meshFactory,sceneManager);
const player = await quiditchFactory.createPlayer();

sceneManager.addTickable(player);


const ball = await quiditchFactory.createBall();
ball.setPosition(0,10);
sceneManager.addTickable(ball);

const rapierPlayerController = new QuiditchPlayerController(player, inputController);
sceneManager.addTickable(rapierPlayerController);

const plane = await quiditchFactory.createPlane();
sceneManager.addTickable(plane);

const debugRenderer = new RapierDebugRenderer(scene, world, 2);
sceneManager.addTickable(debugRenderer);

const targetMesh = new Mesh(new SphereGeometry(0.1,16,32), new MeshBasicMaterial({color:"red"}));
scene.add(targetMesh)

const mouseInputController = new MouseInputController(player,(event)=>{
    let result: Vector2d = null;
    const rect = canvas.getBoundingClientRect();
    const clientX = (event as MouseEvent).clientX||(event as TouchEvent).touches[0].clientX;
    const clientY = (event as MouseEvent).clientY||(event as TouchEvent).touches[0].clientY;
    let viewportDown = new Vector2();
    viewportDown.x = (((clientX - rect.left) / rect.width) * 2) - 1;
    viewportDown.y = - (((clientY - rect.top) / rect.height) * 2) + 1;

    const mesh = ((plane as MeshBasedActor).getMesh() as ThreeBasedMesh).getMesh();
    const rayCaster = new Raycaster();
    rayCaster.setFromCamera(viewportDown, sceneManager._camera);
   
    const intersectResult = rayCaster.intersectObject(mesh);
    if (intersectResult.length > 0) {
        result = new Vector2d(intersectResult[0].point.x, intersectResult[0].point.y);
        targetMesh.position.set(intersectResult[0].point.x, intersectResult[0].point.y, 2);
        
    }
    return result;
}, sceneManager);
const rapierMousePlayerController = new QuiditchPlayerController(player, mouseInputController);
sceneManager.addTickable(rapierMousePlayerController);

sceneManager.startTime();
// document.addEventListener("click",function (event){
    
//     const rect = canvas.getBoundingClientRect();
//     let viewportDown = new Vector2();
//     viewportDown.x =   ( ( ( event.clientX - rect.left) / rect.width ) * 2 ) - 1;
//     viewportDown.y = - ( ( ( event.clientY - rect.top) / rect.height ) * 2 ) + 1;
//     const res:Vector3= new Vector3(viewportDown.x,viewportDown.y,0);
    
//     const mesh = ((plane as MeshBasedActor).getMesh() as ThreeBasedMesh).getMesh();
//     const rayCaster = new Raycaster();
//     rayCaster.setFromCamera(viewportDown,sceneManager._camera);
    
//     console.log(rayCaster.intersectObject(mesh))
// })