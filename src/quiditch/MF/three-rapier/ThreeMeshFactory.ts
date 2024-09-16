import { BufferAttribute, BufferGeometry, ConeGeometry, Group, Light, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3DEventMap, PlaneGeometry, Scene, SphereGeometry, SpotLight } from "three";
import { IMesh } from "../../../engine/MF/IMesh";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { ThreeBasedMesh } from "../../../engine/MF/three/ThreeBasedMesh";
import { createArenaBuffer32Array3D } from "../../../tools";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export class ThreeMeshFactory implements IQuiditchFactory<IMesh>{
    private readonly _scene:Scene;
    private readonly _zHeight: number;

    private readonly _gltfLoader:GLTFLoader;
    constructor(scene:Scene, zHeight: number){
        this._scene = scene;
        this._zHeight = zHeight;

        this._gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        this._gltfLoader.setDRACOLoader(dracoLoader);
    }
    async createWalls(): Promise<IMesh> {
        const buffer = createArenaBuffer32Array3D(20, 50, 2);
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(buffer, 3));
        const material = new MeshBasicMaterial({
            color: "blue"
            ,wireframe: true
        });
        const mesh = new Mesh(geometry, material);
        this._scene.add(mesh);
        return new ThreeBasedMesh(mesh);
    }
    async createGround(): Promise<IMesh> {
        const planeMesh = new Mesh(new PlaneGeometry(500, 500, 2), new MeshBasicMaterial({
            color: 'green'
        }));
        this._scene.add(planeMesh);
        //planeMesh.position.z = this._zHeight;
        return new ThreeBasedMesh(planeMesh);
    }
    async createBall(): Promise<IMesh> {
        
        const mesh = await this._createBallMesh();
        this._scene.add(mesh);
        mesh.position.z = this._zHeight;
        return new ThreeBasedMesh(mesh);
    }
    async createPlayer(): Promise<IMesh> {
        const mesh = await this._createPlayerMesh();
        this._scene.add(mesh);
        mesh.position.z = this._zHeight;
        return new ThreeBasedMesh(mesh);
    }
    private async _createPlayerMesh():Promise<Mesh>{
        const mesh = await this._loadGltfModel('assets/gltf/hover_bike/scene.gltf');
        mesh.scale.set(0.003,0.003,0.003)
        mesh.rotateX(Math.PI/2)
        mesh.rotateY(Math.PI/2)
        const group = new Group();
        group.add(mesh);
        return group as unknown as Mesh;
    }
    private async  _createBallMesh():Promise<Mesh>{
        
      
        const mesh = await this._loadGltfModel('assets/gltf/magma_ball/scene.gltf');
        mesh.scale.set(0.01,0.01,0.01)
        
        return mesh as unknown as Mesh;
    }
    private async _loadGltfModel(path:string):Promise<Group<Object3DEventMap>>{
        return new Promise((res, rej)=>{
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
                      
                      res(gltf.scene)
            
                }
            )
        }) 
    }
}