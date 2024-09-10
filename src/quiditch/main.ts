import { World } from "@dimforge/rapier2d";
import { Scene } from "three";
import { RapierBodyFactory } from "./MF/three-rapier/RapierBodyFactory";
import { MFQuiditchFactory } from "./MF/MFQuiditchActorFactory";
import { ThreeMeshFactory } from "./MF/three-rapier/ThreeMeshFactory";

import { ThreeSceneManager } from "../engine/MF/three/ThreeSceneManager";
import { InputController } from "../engine/controls/BaseInput";
import { KeyboardInputController } from "../engine/controls/KeyboardInput";
import { GameInputActions } from "./constants";
import { RapierPlayerController } from "./MF/three-rapier/RapierPlayerController";
import { MFActor } from "../engine/MF/MFActor";
import { RapierCollisionManager } from "../engine/MF/rapier/RapierCollisionManager";


let gravity = { x: 0.0, y: 0.0 };
let world = new World(gravity);
const scene = new Scene();

const inputController: InputController<GameInputActions> = new KeyboardInputController({ attack: [" "], moveBackward: ["s"], moveForward: ["w"], turnLeft: ["a"], turnRight: ["d"] });

const canvas = document.querySelector("#app") as HTMLCanvasElement;
const collisionManager = new RapierCollisionManager(world);
const sceneManager = new ThreeSceneManager({ height: window.innerHeight, width: window.innerWidth }, canvas, scene, collisionManager);
const bodyFactory = new RapierBodyFactory(world);
const meshFactory = new ThreeMeshFactory(scene, 2);
const quiditchFactory = new MFQuiditchFactory(bodyFactory, meshFactory);
const player = await quiditchFactory.createPlayer();

sceneManager.addTickable(player);


const ball = await quiditchFactory.createBall();
ball.setPosition(2,2);
sceneManager.addTickable(ball);

const rapierPlayerController = new RapierPlayerController(player as MFActor, inputController, world);
sceneManager.addTickable(rapierPlayerController);

sceneManager.startTime();