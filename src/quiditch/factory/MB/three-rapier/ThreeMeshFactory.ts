import { AdditiveBlending, AnimationMixer, BoxGeometry, BufferAttribute, BufferGeometry, CircleGeometry, Color, CylinderGeometry, Group, Light, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, Object3DEventMap, PlaneGeometry, Points, RawShaderMaterial, Scene, ShaderMaterial, SphereGeometry, SpotLight, TextureLoader, TorusGeometry, Vector2 } from "three";
import { IMesh } from "../../../../engine/MB/IMesh";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { ThreeBasedMesh } from "../../../../engine/MB/three/ThreeBasedMesh";
import { createArenaBuffer32Array3D } from "../../../../tools";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { ThreeSceneManager } from "../../../../engine/MB/three/ThreeSceneManager";
import { ITickable } from "../../../../engine/base/ITickable";
import { Pointer } from "../components/Pointer";
import { IObject2D } from "../../../../engine/base/IObject2D";
import { IActor } from "../../../../engine/base/Actor/IActor";
import { GroundMaterial } from "./materials/groundMaterial";
import { RagingSeaMaterial } from "./materials/ragingSeaMaterial";
import { GalaxyMaterial } from "./materials/galaxyMaterial";
import { SmokeMaterial } from "./materials/smokeMaterial";
import { HologramMaterial } from "./materials/hologramMaterial";
import { Grassmaterial } from "./materials/grassMaterial";
import { TextMaterial } from "./materials/textMaterial";



export class ThreeMeshFactory implements IQuiditchFactory<IMesh>{
    private readonly _sceneManager:ThreeSceneManager;
    private readonly _zHeight: number;

    private readonly _gltfLoader:GLTFLoader;

    private readonly _prototypesMeshesMap: Map<string, Mesh>=new Map<string, Mesh>();
    constructor(scene:ThreeSceneManager, zHeight: number){
        this._sceneManager = scene;
        this._zHeight = zHeight;

        this._gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        this._gltfLoader.setDRACOLoader(dracoLoader);
    }
    async createGalaxy(): Promise<Points> {
        const parameters: any = {}
        parameters.count = 200000
        parameters.size = 0.005
        parameters.radius = 5
        parameters.branches = 3
        parameters.spin = 1
        parameters.randomness = 0.5
        parameters.randomnessPower = 3
        parameters.insideColor = '#ff6030'
        parameters.outsideColor = '#1b3984'
        const geometry = new BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count)
    const randomness = new Float32Array(parameters.count*3)
    const insideColor = new Color(parameters.insideColor)
    const outsideColor = new Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Position
        const radius = Math.random() * parameters.radius

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        randomness[i3] = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        randomness[i3+1] = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        randomness[i3+2] = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3    ] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = 0.0
        positions[i3 + 2] = Math.sin(branchAngle) * radius

        // Color
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / parameters.radius)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        // Scale
        scales[i]= Math.random()

    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('color', new BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new BufferAttribute(scales, 1))
    geometry.setAttribute('aRandomness', new BufferAttribute(randomness, 3))

    /**
     * Material
     */
    const pixelRatio = this._sceneManager.getPixelRatio();
    const material = new GalaxyMaterial(pixelRatio);
    this._sceneManager.addTickable(material)
    /**
     * Points
     */
    
    const points = new Points(geometry, material.getMaterial());
    //points.rotation.x = Math.PI/2;
    points.rotation.y = Math.PI/2;
    points.position.z = 0
   
    
         return points;
    }
    async createGates(ringRadius: number): Promise<IMesh> {
        const mesh = new Group();
        const material = new MeshBasicMaterial({
            color:'gold'
        });
        const ringGeom = new TorusGeometry(ringRadius,0.1*ringRadius,12,48);
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
        return threebasedMesh;
    }
    async createPointer(targetObject?: IObject2D, sourceActor?:IActor): Promise<Pointer> {
        const mesh = await this._loadGltfModel('assets/gltf/pointer/scene.gltf');
        // /mesh.scale.set(0.003,0.003,0.003)
        mesh.rotateX(Math.PI/2)
        mesh.position.z = this._zHeight;
        mesh.position.y = 2;
        const group = new Group();
        group.add(mesh);
        this._sceneManager.getScene().add(group);
        const threebasedMesh = new ThreeBasedMesh(group);
        return new Pointer("pointer",threebasedMesh,targetObject,sourceActor);
    }
    async createWalls(): Promise<IMesh> {
        // const buffer = createArenaBuffer32Array3D(20, 50, this._zHeight);
        // const geometry = new BufferGeometry();
        //geometry.setAttribute('position', new BufferAttribute(buffer, 3));
        const material = new MeshBasicMaterial({
            color: "blue"
            ,wireframe: true
        });
        const ringGeom = new TorusGeometry(70,0.1*70,12,48);
        
        const mesh = new Mesh(ringGeom, material);
        mesh.position.z = this._zHeight*2;
        this._sceneManager.getScene().add(mesh);
        return new ThreeBasedMesh(mesh);
    }
    async createGround(): Promise<IMesh> {
       
        
        
        const res = new Group();
        const textureLoader = new TextureLoader()
        // const flagTexture = textureLoader.load('textures/flag-french.jpg')
        // const shaderMaterial = new GroundMaterial(flagTexture);

        // const shaderMaterial = new RagingSeaMaterial(flagTexture);

        // this._sceneManager.addTickable(shaderMaterial);
        // const planeMesh = new Mesh(new PlaneGeometry(20, 20, 128, 128), shaderMaterial.getMaterial());
        // res.add(planeMesh);

        //const galaxy = await this.createGalaxy();   
        //res.add(galaxy);        
       

        // const smokeMesh = this._createSmoke();
        // smokeMesh.position.z = -3;
        // res.add(smokeMesh);

        const holoMesh = this._createHologram();
        res.add(holoMesh);

        // const grassMesh = this._createGrass();
        // res.add(grassMesh);

        //  const textMesh = this._createText();
        // res.add(textMesh);
        
        this._sceneManager.getScene().add(res);
        return new ThreeBasedMesh(res);
    }

    _createGrass(){
        const grassGeometry = new PlaneGeometry(1, 1, 16, 64);
        grassGeometry.rotateX(Math.PI/2)
        const grassMaterial = new Grassmaterial();
        this._sceneManager.addTickable(grassMaterial);
        return new Mesh(grassGeometry, grassMaterial.getMaterial());
    }
    _createText(){
        const textGeometry = new PlaneGeometry(5, 5, 64, 16);
        textGeometry.rotateX(Math.PI/2)
        const textMaterial = new TextMaterial();
        this._sceneManager.addTickable(textMaterial);
        return new Mesh(textGeometry, textMaterial.getMaterial());
    }
    private _createSmoke():Mesh {
        const smokeGeometry = new PlaneGeometry(1, 1, 16, 64);
        smokeGeometry.translate(0, 0.5, 0)
        smokeGeometry.scale(1.5, 6, 1.5)

        const smokeMaterial = new SmokeMaterial();
        this._sceneManager.addTickable(smokeMaterial);
        smokeGeometry.rotateX(Math.PI/2)
        return new Mesh(smokeGeometry, smokeMaterial.getMaterial());
    }
    private _createHologram():Mesh {
        const smokeGeometry = new SphereGeometry(2,32,64);
        smokeGeometry.rotateX(-Math.PI)
        
        const smokeMaterial = new HologramMaterial();
        this._sceneManager.addTickable(smokeMaterial);
      
        return new Mesh(smokeGeometry, smokeMaterial.getMaterial());
    }
    async createQuaffle(): Promise<IMesh> {
        
        const mesh = await this._createBallMesh();
        this._sceneManager.getScene().add(mesh);
        mesh.position.z = this._zHeight;
        return new ThreeBasedMesh(mesh);
    }
    async createPlayer(color?:string): Promise<IMesh> {
        const mesh = await this._createPlayerMesh(color);
        this._sceneManager.getScene().add(mesh);
        mesh.position.z = this._zHeight;
        return new ThreeBasedMesh(mesh);
    }

    private async _createPlayerMesh(color?:string):Promise<Mesh>{
        let mesh = this._prototypesMeshesMap.get("player")
        if(!mesh){
            const model = await this._loadGltfModel('assets/glb/hover_bike/scene.glb');
            model.rotateX(Math.PI/2)
            model.rotateY(Math.PI/2)
            model.scale.set(0.003,0.003,0.003)
           
            mesh = new Group() as unknown as Mesh;
            mesh.add(model);
           
            this._prototypesMeshesMap.set("player", mesh);
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

        let mesh = this._prototypesMeshesMap.get("quaffle")
        if (!mesh) {
            const model = await this._loadGltfModel('assets/gltf/magma_ball/scene.gltf');
            model.scale.set(0.02, 0.02, 0.02);

            model.position.z = 1.5;
            model.position.x = -0.24;
            model.position.y = -0.36;
            mesh = new Group() as unknown as Mesh;
            mesh.add(model);

            this._prototypesMeshesMap.set("quaffle", mesh);
        }
        return mesh.clone();
    }
    private async _loadGltfModel(path:string):Promise<Group<Object3DEventMap>>{
        const sceneManager = this._sceneManager;
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