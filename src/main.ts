import './style.css'

import RAPIER, { RigidBody, Vector, Vector2 } from '@dimforge/rapier2d';
import * as THREE from 'three'
import { PlaneGeometry, MeshBasicMaterial, AmbientLight, Mesh, ConeGeometry } from 'three'

import SimpleScene from './components/SimpleScene';
import { createCircleBuffer32Array } from './tools';
import { RingGates } from './components/RingGates';
import { RapierDebugRenderer } from './utils/debugRenderer';



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

const characterMesh = new Mesh(new ConeGeometry(0.2, 2, 16), new MeshBasicMaterial({
  color: 'black'
}));

characterMesh.position.x = -3;
characterMesh.position.z = debugObj.z;
scene.add(characterMesh);





scene.gui.add(debugObj, 'rotateSpeed').min(0.01).max(0.1).step(0.01)
scene.gui.add(debugObj, 'speed').min(0.01).max(0.1).step(0.01)

let rotation = 0.0;
let speed = 0.0;
document.addEventListener('keydown', (e) => {
  if (e.key === 'a') {
    rotation = debugObj.rotateSpeed;
  }
  if (e.key === 'd') {
    rotation = -debugObj.rotateSpeed;
  }
  if (e.key === 'w') {
    speed = debugObj.speed;
  }
  if (e.key === 's') {
    speed = -debugObj.speed;
  }
})
document.addEventListener('keyup', (e) => {
  if (e.key === 'a' || e.key === 'd') {
    rotation = 0.0
  }
  if (e.key === 'w' || e.key === 's') {
    speed = 0.0
  }
})







let gravity = { x: 0.0, y: 0.0 };
let world = new RAPIER.World(gravity);

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

const cubeShape = RAPIER.ColliderDesc.ball(0.3).setMass(0.5).setRestitution(1.1);
const collider = world.createCollider(cubeShape, cubeBody)
dynamicBodies.push([cubeMesh, cubeBody])



//const stats = new Stats()
//document.body.appendChild(stats.dom)


// Character.
let characterDesc =
  RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0);
let characterBody = world.createRigidBody(characterDesc);
let characterColliderDesc = RAPIER.ColliderDesc.ball(0.4);
let characterCollider = world.createCollider(
  characterColliderDesc,
  characterBody,
);

let characterController = world.createCharacterController(0.1);
scene.camera.position.z = 15
scene.camera.rotation.x = Math.PI/6
scene.camera.position.y = -13

scene.start()
//stats.update()

//joint
let params = RAPIER.JointData.revolute({ x: 0.8, y: 0.0 }, { x: 0.1, y: 0.0 });
let joint = world.createImpulseJoint(params, characterBody, cubeBody, true);
(joint as RAPIER.RevoluteImpulseJoint).configureMotorVelocity(5.0, 0.0);
const updateCharacter = () => {
  const velocity = characterBody.linvel();
  //console.log(velocity)

  characterBody.setRotation(characterBody.rotation() + rotation, false);
  const directionVector = new RAPIER.Vector2(
    -Math.sin(characterBody.rotation()) * speed,
    Math.cos(characterBody.rotation()) * speed
  )

  //console.log(rotation)

  characterController.computeColliderMovement(characterCollider,
    directionVector
  );

  const movement = characterController.computedMovement();
  characterController.setApplyImpulsesToDynamicBodies(true)
  const newPos = characterBody.translation();
  newPos.x += movement.x;
  newPos.y += movement.y;
  characterBody.setNextKinematicTranslation(newPos);
  //console.log("character.translation",characterBody.translation())
  characterMesh.position.x = characterBody.translation().x;
  characterMesh.position.y = characterBody.translation().y;
  characterMesh.rotation.z = characterBody.rotation();
}

scene.addUpdateHandler((elapsedTime, delta) => {


  world.timestep = Math.min(delta, 0.1)

  updateCharacter()

  // //const eventQueue = new RAPIER.EventQueue(true);
  // eventQueue.drainCollisionEvents((h1, h2, stared)=>{
  //     console.log(h1)
  // })
  world.step()




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
  console.log(angle, Math.sin(angle), Math.cos(angle), spawnPos)
  let ballBody = world.createRigidBody(ballBodyDesc)
  ballBody.setTranslation(spawnPos, true)
  //console.log(spawnPos)
  const ballColliderDesc = RAPIER.ColliderDesc.ball(0.1).setMass(0.2).setRestitution(0.7);
  world.createCollider(ballColliderDesc, ballBody);
  //console.log(collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS))

  dynamicBodies.push([mesh, ballBody])
  const impules = { x: -Math.sin(angle) * 5, y: Math.cos(angle) * 5 };

  ballBody.applyImpulse(impules, true)
}
document.addEventListener('keypress', (e) => {
  if (e.key === ' ') {
    spawnball(characterBody.translation(), characterBody.rotation())
  }
})
const gates = new RingGates(scene,world,debugObj.z,{x:0,y:4,z:0}, undefined,1.5);
const gates1 = new RingGates(scene,world,debugObj.z,{x:5,y:4,z:0}, undefined,1);
const gates2 = new RingGates(scene,world,debugObj.z,{x:-5,y:4,z:0},undefined,1);

const debugRenderer = new RapierDebugRenderer(scene,world);
scene.addUpdateHandler(()=>{
  debugRenderer.update()
})
