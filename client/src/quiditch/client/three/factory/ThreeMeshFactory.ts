import { AnimationMixer, BoxGeometry, BufferAttribute, BufferGeometry, CapsuleGeometry, CircleGeometry, CylinderGeometry, Group, Light, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, Object3DEventMap, PlaneGeometry, Scene, SpotLight, TorusGeometry } from "three";
import { IQuiditchFactory } from "../../../common/IQuiditchActorFactory";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { ITickable } from "@common/ITickable";

import { ActorNames } from "../../../common/constants";
import { ThreeBasedMesh } from "../../../../engine/client/three/ThreeBasedMesh";
import { MeshBasedActor } from "../../../../engine/client/MeshBasedActor";
import { ThreeSceneManager } from "../../../../engine/client/three/ThreeSceneManager";
import { Pointer } from "../../components/Pointer";
import { IActor } from "@common/IActor";
import { IObject2D } from "@common/IObject2D";

export class ThreeMeshFactory implements IQuiditchFactory<MeshBasedActor>{
    private readonly _sceneManager:ThreeSceneManager;
    private readonly _zHeight: number;

    private readonly _gltfLoader:GLTFLoader;

    private readonly _prototypesMeshesMap: {[id: string]: Mesh}={};

    private readonly _scale: number;
    constructor(scene:ThreeSceneManager, zHeight: number, scale: number){
        this._sceneManager = scene;
        this._zHeight = zHeight*scale;
        this._scale = scale;
        this._gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        this._gltfLoader.setDRACOLoader(dracoLoader);
    }
    async remove(child: MeshBasedActor): Promise<void> {
        (child.getMesh() as ThreeBasedMesh).remove(this._sceneManager.getScene());
    }
    async createGates(ringRadius: number, id:string): Promise<MeshBasedActor> {
        const mesh = new Group();
        const material = new MeshBasicMaterial({
            color:'gold'
        });
        const ringGeom = new TorusGeometry(ringRadius*this._scale,0.1*ringRadius*this._scale,12,48);
        const ringHeight = -ringRadius+this._zHeight;
        const ringMesh = new Mesh(ringGeom,material);
        ringMesh.position.z = ringRadius+ringHeight;
        ringMesh.rotation.x = -Math.PI/2;
        
        const basementGeom = new CylinderGeometry(0.1, 0.1, ringHeight);
        const basementMesh = new Mesh(basementGeom, material);
        basementMesh.position.z=ringHeight/2;
        basementMesh.rotation.x = -Math.PI/2;
        this._sceneManager.getScene().add(mesh);
        mesh.add(ringMesh,basementMesh)
        const threebasedMesh = new ThreeBasedMesh(mesh);
        return new MeshBasedActor(ActorNames.gates,threebasedMesh,id, this._scale);
    }
    async createPointer(targetObject?: IObject2D, sourceActor?:IActor, id?:string): Promise<MeshBasedActor> {
        const mesh = await this._loadGltfModel('assets/gltf/pointer/scene.gltf');
        // /mesh.scale.set(0.003,0.003,0.003)
        mesh.rotateX(Math.PI/2)
        mesh.position.z = this._zHeight;
        mesh.position.y = 2*this._scale;
        const group = new Group();
        group.add(mesh);
        this._sceneManager.getScene().add(group);
        const threebasedMesh = new ThreeBasedMesh(group);
        const pointer = new Pointer(ActorNames.pointer, threebasedMesh, id as string, targetObject, sourceActor, this._scale);
        this._sceneManager.addTickable(pointer);
        
        return pointer;
       
        
    }
    async createWalls( id?:string): Promise<MeshBasedActor> {
        // const buffer = createArenaBuffer32Array3D(20, 50, this._zHeight);
        // const geometry = new BufferGeometry();
        //geometry.setAttribute('position', new BufferAttribute(buffer, 3));
        const material = new MeshBasicMaterial({
            color: "blue"
            ,wireframe: true
        });
        const ringGeom = new TorusGeometry(70*this._scale,0.1*70*this._scale,12,48);
        
        const mesh = new Mesh(ringGeom, material);
        mesh.position.z = this._zHeight*2;
        this._sceneManager.getScene().add(mesh);
        return new MeshBasedActor(ActorNames.walls,new ThreeBasedMesh(mesh),id as string);
    }
    async createGround(id?:string): Promise<MeshBasedActor> {

        // const grassMaterial  = new Grassmaterial();
        // this._sceneManager.addTickable(grassMaterial);
        const planeMesh = new Mesh(new PlaneGeometry(200*this._scale, 200*this._scale, 1,1), new MeshBasicMaterial({
            color:"green"
        }))//grassMaterial.getMaterial());

        this._sceneManager.getScene().add(planeMesh);
        //planeMesh.position.z = this._zHeight;
        return new MeshBasedActor(ActorNames.ground,new ThreeBasedMesh(planeMesh),id as string);
    }
    async createQuaffle(id?:string): Promise<MeshBasedActor> {
        
        const mesh = await this._createBallMesh();
        this._sceneManager.getScene().add(mesh);
        mesh.position.z = this._zHeight;
        return new MeshBasedActor(ActorNames.quaffle,new ThreeBasedMesh(mesh),id as string, this._scale);
    }
    async createPlayer(color?:string, id?:string): Promise<MeshBasedActor> {
        const mesh = await this._createPlayerMesh(color);
        this._sceneManager.getScene().add(mesh);
        mesh.position.z = this._zHeight;
        return new MeshBasedActor(ActorNames.player,new ThreeBasedMesh(mesh),id as string, this._scale);
    }

    private async _createPlayerMesh(color?:string):Promise<Mesh>{
        
        let mesh:Mesh = new Mesh(new CapsuleGeometry(0.3*this._scale,1.1*this._scale,1), new MeshBasicMaterial({color:color})) 
        return mesh;
         //let mesh = this._prototypesMeshesMap["player"];
        if(!mesh){
            const model = await this._loadGltfModel('assets/glb/hover_bike/scene.glb');
            model.rotateX(Math.PI/2)
            model.rotateY(Math.PI/2)
            model.scale.set(0.003,0.003,0.003)
           
            mesh = new Group() as unknown as Mesh;
            mesh.add(model);
           
            this._prototypesMeshesMap["player"] = mesh;
        }
        const clone :Mesh = mesh.clone();
        
        const circle = new CircleGeometry(3);
        const circleMaterial = new MeshBasicMaterial({
            color:color||"blue",
            opacity:0.3,
            transparent:true
        })
       
        const cicleMesh = new Mesh(circle,circleMaterial);
        clone.add(cicleMesh);
        
        return clone;
       
    }
    private async _createBallMesh(): Promise<Mesh> {

        let mesh = this._prototypesMeshesMap["quaffle"]
        if (!mesh) {
            const model = await this._loadGltfModel('assets/gltf/magma_ball/scene.gltf');
            model.scale.set(0.02*this._scale, 0.02*this._scale, 0.02*this._scale);

            model.position.z = 1.5;
            model.position.x = -0.24;
            model.position.y = -0.36;
            mesh = new Group() as unknown as Mesh;
            mesh.add(model);

            this._prototypesMeshesMap["quaffle"]= mesh;
        }
        return mesh.clone();
    }
    private async _loadGltfModel(path:string):Promise<Group<Object3DEventMap>>{
        const sceneManager = this._sceneManager;
        return new Promise((res, rej)=>{
            console.log("load model",path)
            this._gltfLoader.load(
                // resource URL
                path,
                // called when the resource is loaded
                function ( gltf ) {
            
                    gltf.scene.traverse(function (child) {
                        if ((child as Mesh).isMesh) {
                          const m = child as Mesh
                          m.receiveShadow = true
                          m.castShadow = true
                        }
                        if ((child as Light).isLight) {
                          const l = child as SpotLight
                          l.castShadow = true
                          l.shadow.bias = -0.003
                          l.shadow.mapSize.width = 2048
                          l.shadow.mapSize.height = 2048
                        }
                      })
                      if(gltf.animations.length>0){
                        const mixer = new AnimationMixer(gltf.scene);
                        const action = mixer.clipAction(gltf.animations[0]);
                        
                        action.play();
                        sceneManager.addTickable(new TickMixer(mixer));
                      }
                     
                      res(gltf.scene)
            
                }
            )
        }) 
    }
}
class TickMixer implements ITickable{
    private readonly _mixer:AnimationMixer;
    constructor(mixer:AnimationMixer){
        this._mixer = mixer;
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
       this._mixer.update(deltaTime);
    }

}