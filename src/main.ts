import './style.css'

import RAPIER, { EventQueue, RigidBody, Vector2 } from '@dimforge/rapier2d';
import * as THREE from 'three'
import { PlaneGeometry, MeshBasicMaterial, AmbientLight, Mesh } from 'three'

import SimpleScene from './components/SimpleScene';
import { createCircleBuffer32Array } from './tools';
import { RingGates } from './components/RingGates';
import { RapierDebugRenderer } from './utils/debugRenderer';
import { PhysicsMeshArgs } from './components/PhysicsMesh';
import { CollisionGroups } from './constants';
import { CharacterArgs, CharacterController } from './components/CharacterController';



const canvas = document.querySelector("#app") as HTMLCanvasElement;

const scene = new SimpleScene(canvas)


const debugObj = {
  rotateSpeed: 0.05,
  speed: 0.05, 
  z: 3
}


const planeGeom = new PlaneGeometry(35, 35);
const material = new MeshBasicMaterial({
  color: 'green',
  side:2,
})

const ground = new Mesh(planeGeom, material);
ground.position.z=0;
scene.add(ground)


const light = new AmbientLight()
scene.add(light)






scene.gui.add(debugObj, 'rotateSpeed').min(0.01).max(0.1).step(0.01)
scene.gui.add(debugObj, 'speed').min(0.01).max(0.1).step(0.01)


const charArgs:CharacterArgs={
  rotationSpeed:0,
  speed:0
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'a') {
    charArgs.rotationSpeed = debugObj.rotateSpeed;
  }
  if (e.key === 'd') {
    charArgs.rotationSpeed = -debugObj.rotateSpeed;
  }
  if (e.key === 'w') {
    charArgs.speed = debugObj.speed;
  }
  if (e.key === 's') {
    charArgs.speed = -debugObj.speed;
  }
})
document.addEventListener('keyup', (e) => {
  if (e.key === 'a' || e.key === 'd') {
    charArgs.rotationSpeed = 0.0
  }
  if (e.key === 'w' || e.key === 's') {
    charArgs.speed = 0.0
  }
})







let gravity = { x: 0.0, y: 0.0 };

let world = new RAPIER.World(gravity);
const eventQueue = new EventQueue(true);
// Create the ground
let groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
let groundBody = world.createRigidBody(groundBodyDesc);
const polyLine = createCircleBuffer32Array(10,10000);
world.createCollider(RAPIER.ColliderDesc.polyline(polyLine.verticies),groundBody);

const wallMaterial = new MeshBasicMaterial({
  color: 'brown',
  side: THREE.DoubleSide
})


for(let i = 0;i<20; i++){
  
const tourusGeom = new THREE.TorusGeometry(10+i*0.04,0.04);
const arenaMesh = new Mesh(tourusGeom,wallMaterial);
arenaMesh.position.z=i*0.1;
scene.add(arenaMesh);
}


const dynamicBodies: [THREE.Mesh, RAPIER.RigidBody][] = []

//test sphere
const cubeGeom = new THREE.SphereGeometry(0.3)
const cubeMesh = new THREE.Mesh(cubeGeom, new THREE.MeshBasicMaterial({
  color: 'orange'
}))
cubeMesh.position.z = debugObj.z;
scene.add(cubeMesh)
const cubeBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setCcdEnabled(true).setTranslation(3, 0).setCanSleep(false))

const ballColliderDesc = RAPIER.ColliderDesc.ball(0.3).setMass(0.5).setRestitution(1.1).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
const collider = world.createCollider(ballColliderDesc, cubeBody)
dynamicBodies.push([cubeMesh, cubeBody])


scene.camera.position.z = 15
scene.camera.rotation.x = Math.PI/6
scene.camera.position.y = -13

scene.start()

const character = new CharacterController(
  {
    scene,
    world,
    zHeight: debugObj.z,
    collisionFilterGroups: [
      CollisionGroups.wall,
      CollisionGroups.gates
    ],
    collisionMemberGroups: [CollisionGroups.character]
  },
  charArgs)
//joint
// let params = RAPIER.JointData.revolute({ x: 0.8, y: 0.0 }, { x: 0.1, y: 0.0 });
// let joint = world.createImpulseJoint(params, character.body as RigidBody, cubeBody, true);
// (joint as RAPIER.RevoluteImpulseJoint).configureMotorVelocity(5.0, 0.0);


scene.addUpdateHandler((elapsedTime, delta) => {


  world.timestep = Math.min(delta, 0.1)
  
  character.update()
  world.step(eventQueue)
  eventQueue.drainContactForceEvents((evt)=>{
    console.log(evt)
})

  for (let i = 0;  i < dynamicBodies.length; i++) {
    try {
      const body = dynamicBodies[i][1];
      const newPhysicsPosition = new THREE.Vector3(body.translation().x, body.translation().y, debugObj.z);
      dynamicBodies[i][0].position.copy(newPhysicsPosition)
      dynamicBodies[i][0].rotation.z = dynamicBodies[i][1].rotation();
      const origin:Vector2 = body.translation() as Vector2;
      const dir = new RAPIER.Vector2(Math.sin(body.rotation()), Math.cos(body.rotation()));
      const hit = world.castRayAndGetNormal(new RAPIER.Ray(origin,
        dir), 0.5, false, undefined,
        undefined, undefined, body);
      if (hit) {
        let hitted = false;

         const point:Vector2 = new Vector2(origin.x+dir.x*hit.timeOfImpact, origin.y+dir.y*hit.timeOfImpact);
        // const origMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshBasicMaterial({
        //   color:"black"
        // }));
        // origMesh.position.set(origin.x, origin.y,1);
        // scene.add(origMesh)
        // const pointMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshBasicMaterial({
        //   color:"pink"
        // }));
        // pointMesh.position.set(point.x, point.y,1);
        // scene.add(pointMesh)

        const dist = (new THREE.Vector2(point.x-origin.x, point.y-origin.y)).length();
        if(dist<2){
        [...dynamicBodies].forEach((obj: [THREE.Mesh, RigidBody]) => {
          if (obj[1] === hit.collider.parent()) {
            // console.log(obj);
            obj[0].material = new MeshBasicMaterial({
              color: 'red'
            })
            hitted = true;
            setTimeout(() => {
              obj[0].material = new MeshBasicMaterial({
                color: 'blue'
              })
            }, 1000)
            return;
          }         
        })
        //if (hitted) {
          // world.removeRigidBody(body);
          // const mesh = dynamicBodies[i][0];
          // scene.remove(mesh);
          // dynamicBodies.splice(i,1);
          // i--;
        
      
        }
      }
      //}
    } catch (ex) {
      console.error(ex);
    }
  }
  debugRenderer.update()
})

const spawnball = (pos: { x: number, y: number }, angle: number) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({
    color: "purple"
  }));
  mesh.position.z = debugObj.z;
  scene.add(mesh)
  // Create the body
  let ballBodyDesc = RAPIER.RigidBodyDesc.dynamic().setLinearDamping(0.1).setCcdEnabled(true);

  
  const spawnPos: RAPIER.Vector2 = { x: pos.x - Math.sin(angle)*2, y: pos.y + Math.cos(angle)*2 }
  //console.log(angle, Math.sin(angle), Math.cos(angle), spawnPos)
  let ballBody = world.createRigidBody(ballBodyDesc)
  ballBody.setTranslation(spawnPos, true)
  //console.log(spawnPos)
  const ballColliderDesc = RAPIER.ColliderDesc.ball(0.1).setMass(0.2).setRestitution(0.7);
  world.createCollider(ballColliderDesc, ballBody).setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS);


  dynamicBodies.push([mesh, ballBody])
  const impules = { x: -Math.sin(angle) * 5, y: Math.cos(angle) * 5 };

  ballBody.applyImpulse(impules, true)
}
document.addEventListener('keypress', (e) => {
  if (e.key === ' ') {
    spawnball((character.body as RigidBody).translation(), (character.body as RigidBody).rotation())
  }
})

const gateArgs:PhysicsMeshArgs = {
  scene,
  world,
  zHeight:debugObj.z,
  collisionMemberGroups:[CollisionGroups.gates],
  collisionFilterGroups:[CollisionGroups.ball,CollisionGroups.character],
}
const gates = new RingGates({...gateArgs,translation:{x:0,y:4,z:0}},1.5);
const gates1 = new RingGates({...gateArgs,translation:{x:5,y:4,z:0}}, 1);
const gates2 = new RingGates({...gateArgs,translation:{x:-5,y:4,z:0}}, 1);

const debugRenderer = new RapierDebugRenderer(scene,world, debugObj.z);
