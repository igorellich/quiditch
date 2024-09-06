import './style.css'

import RAPIER from '@dimforge/rapier2d';

import SimpleScene from './components/SimpleScene';
import { RapierDebugRenderer } from './utils/debugRenderer';
import { CollisionGroups, GameInputActions } from './constants';
import { Character } from './components/character/Character';
import { InputController } from './engine/controls/BaseInput';
import { KeyboardInputController } from './engine/controls/KeyboardInput';
import { CharacterController } from './components/character/CharactecterController';
import { ContactBall } from './components/balls/ContactBall';
import { InstanceStore } from './engine/store/InstanceStore';
import { AICharacterController } from './components/ai/AICharacterController';
import { Arena } from './components/arena/Arena';

const canvas = document.querySelector("#app") as HTMLCanvasElement;

const scene = new SimpleScene(canvas)
const debugObj = {
  rotationSpeed: 0.05,
  speed: 0.05,
  z: 3
}



scene.gui.add(debugObj, 'rotationSpeed').min(0.01).max(0.1).step(0.01)
scene.gui.add(debugObj, 'speed').min(0.01).max(0.1).step(0.01)

let gravity = { x: 0.0, y: 0.0 };

let world = new RAPIER.World(gravity);









// const wallMaterial = new MeshBasicMaterial({
//   color: 'brown',
//   side: THREE.DoubleSide
// })

// for (let i = 0; i < 20; i++) {

//   const tourusGeom = new THREE.TorusGeometry(10 + i * 0.04, 0.04);
//   const arenaMesh = new Mesh(tourusGeom, wallMaterial);
//   arenaMesh.position.z = i * 0.1;
//   scene.add(arenaMesh);
// }

scene.camera.position.z = 15
scene.camera.rotation.x = Math.PI / 6
scene.camera.position.y = -13

scene.start()

const store = new InstanceStore();

const arena = new Arena({
  scene,
  store,
  world,
  zHeight: debugObj.z,
  collisionFilterGroups:[CollisionGroups.ball,CollisionGroups.character],
  collisionMemberGroups:[CollisionGroups.wall]
}, 7,10)

const inputController: InputController<GameInputActions> = new KeyboardInputController({ attack: [" "], moveBackward: ["s"], moveForward: ["w"], turnLeft: ["a"], turnRight: ["d"] });



const character = new Character(
  {
    scene,
    world,
    zHeight: debugObj.z,
    collisionFilterGroups: [
      CollisionGroups.wall,
      CollisionGroups.gates
    ],
    collisionMemberGroups: [CollisionGroups.character],
    store,
    translation:{x:-0, y:-0}
  }
)
//const aiCharacter = new AICharacterController(character,store,scene, debugObj);
const charController = new CharacterController(character, inputController, debugObj);


const contactBall = new ContactBall({
  scene,world,zHeight:debugObj.z,
  store,translation:{x:0,y:  0},
  collisionFilterGroups:[CollisionGroups.wall,CollisionGroups.character],
  collisionMemberGroups:[CollisionGroups.ball]
})
scene.addUpdateHandler((elapsedTime, delta) => {

  world.timestep = Math.min(delta, 0.1)

  //character.update()
  const eventQueue = new RAPIER.EventQueue(true);
  world.step(eventQueue)
  eventQueue.drainCollisionEvents((c1,c2, start) => {
    console.log(c1,c2,start)
  })

 
  debugRenderer.update()
})



const debugRenderer = new RapierDebugRenderer(scene, world, debugObj.z);
