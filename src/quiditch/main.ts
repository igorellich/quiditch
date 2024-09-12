import { World } from "@dimforge/rapier2d";
import { Scene, Vector2, Vector3 } from "three";
import { RapierBodyFactory } from "./MF/three-rapier/RapierBodyFactory";
import { MFQuiditchFactory } from "./MF/MFQuiditchActorFactory";
import { ThreeMeshFactory } from "./MF/three-rapier/ThreeMeshFactory";

import { ThreeSceneManager } from "../engine/MF/three/ThreeSceneManager";
import { InputController } from "../engine/controls/BaseInput";
import { KeyboardInputController } from "../engine/controls/KeyboardInput";
import { GameInputActions } from "./constants";
import { RapierPlayerController } from "./MF/three-rapier/RapierPlayerController";
import { MFActor } from "../engine/MF/MFActor";
import { RapierPhysicsManager } from "../engine/MF/rapier/RapierPhysicsManager";
import { RapierDebugRenderer } from "../utils/debugRenderer";


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
ball.setPosition(5,5);
sceneManager.addTickable(ball);

const rapierPlayerController = new RapierPlayerController(player, inputController, world);
sceneManager.addTickable(rapierPlayerController);

const plane = await quiditchFactory.createPlane();
sceneManager.addTickable(plane);

const debugRenderer = new RapierDebugRenderer(scene, world, 2);
sceneManager.addTickable(debugRenderer);


sceneManager.startTime();
document.addEventListener("click",function (event){
    
    const rect = canvas.getBoundingClientRect();
    let viewportDown = new Vector2();
    viewportDown.x =   ( ( ( event.clientX - rect.left) / rect.width ) * 2 ) - 1;
    viewportDown.y = - ( ( ( event.clientY - rect.top) / rect.height ) * 2 ) + 1;
    const res:Vector3= new Vector3(viewportDown.x,viewportDown.y,0);
    console.log(res.unproject(sceneManager._camera));
   
})