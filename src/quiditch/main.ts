import { World } from "@dimforge/rapier2d";
import { RapierBodyFactory } from "./MF/three-rapier/RapierBodyFactory";
import { MFQuiditchFactory } from "./MF/MFQuiditchActorFactory";
import { ThreeMeshFactory } from "./MF/three-rapier/ThreeMeshFactory";
import {Scene } from "three";
import { ThreeSceneManager } from "./MF/three-rapier/ThreeSceneManager";


let gravity = { x: 0.0, y: 0.0 };

let world = new World(gravity);
const scene = new Scene();
const canvas = document.querySelector("#app") as HTMLCanvasElement;
const sceneManager = new ThreeSceneManager({height:window.innerHeight, width:window.innerWidth}, canvas, scene);
const bodyFactory = new RapierBodyFactory(world);
const meshFactory = new ThreeMeshFactory(scene,2);
const quiditchFactory = new MFQuiditchFactory(bodyFactory,meshFactory);
const player = await quiditchFactory.createPlayer();
sceneManager.addActor(player);

sceneManager.startTime();