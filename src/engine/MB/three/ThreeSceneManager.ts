import { AmbientLight, CameraHelper, Clock, DirectionalLight, DirectionalLightHelper, PerspectiveCamera, PointLight, Scene, SpotLight, WebGLRenderer } from "three";
import { SceneManager, Size } from "../../base/SceneManager"
import { IPhysicsManager } from "../../base/IPhysicsManager";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IActor } from "../../base/Actor/IActor";
import { PersuingCamera } from "./PersuingCamera";


export class ThreeSceneManager extends SceneManager {
    setCameraTarget(target: IActor) {
        this._persuingCamera.setTarget(target);
    }

    private readonly _persuingCamera: PersuingCamera;

    private readonly _renderer: WebGLRenderer;

    private _clock: Clock = new Clock();

    private readonly _scene: Scene;

    
    async tick() {
       await super.tick();

    }

    constructor(size: Size, canvas: HTMLCanvasElement, scene: Scene, physicsManager?: IPhysicsManager) {
        super(size, physicsManager);
        this._scene = scene;
        this._renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,

        });
        this._renderer.shadowMap.enabled = true;
        
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._renderer.setSize(this._size.width, this._size.height);

        const camera = new PerspectiveCamera(75, this._size.width / this._size.height, 0.1, 200);        
        camera.position.z = 50;

        this._persuingCamera = new PersuingCamera(camera, 7);
        this.addTickable(this._persuingCamera);

        const controls = new OrbitControls(camera, this._renderer.domElement);
        controls.enableDamping = true;
        controls.enableRotate=true;

         //const light = new AmbientLight();
       const directionalLight = new DirectionalLight(0xffffff,3);
    
        directionalLight.castShadow = true;
        directionalLight.position.set(70,0,100)
        
        scene.add(directionalLight.target);
        directionalLight.target.position.set(0,0,0);
        directionalLight.target.updateMatrixWorld();
        
        scene.add(directionalLight);
        const helper = new DirectionalLightHelper( directionalLight, 5 );
scene.add( helper );

        
       //Set up shadow properties for the light
       directionalLight.shadow.mapSize.width = 1024; // default
       directionalLight.shadow.mapSize.height = 1024; // default
       directionalLight.shadow.camera.near = 50; // default
       directionalLight.shadow.camera.far = 170; // default
       directionalLight.shadow.camera.left = -100; // default
       directionalLight.shadow.camera.right = 100; // default
       directionalLight.shadow.camera.top = 100; // default
       directionalLight.shadow.camera.bottom = -100; // default
        //scene.add(directionalLight.target);
        const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera)
        scene.add(directionalLightCameraHelper)
        directionalLightCameraHelper.update();
        directionalLightCameraHelper.updateMatrixWorld();
        window.addEventListener('resize', () => {
            this._size.height = window.innerHeight;
            this._size.width = window.innerWidth;

            (this._persuingCamera.getMesh() as PerspectiveCamera).aspect = this._size.width / this._size.height;
            (this._persuingCamera.getMesh() as PerspectiveCamera).updateProjectionMatrix();

            this._renderer.setSize(this._size.width, this._size.height);
            this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


        });

        window.addEventListener('dblclick', () => {

            // if (!document.fullscreenElement) {
            //     this._renderer.domElement.requestFullscreen();
            // } else {
            //     document.exitFullscreen();
            // }
        })

        window.addEventListener('visibilitychange', e => this.handleVisibilityChange(e));

    }
    handleVisibilityChange(e:Event) {
        if (document.visibilityState === 'hidden') {
           this.stopTime();
        } else {
            this.startTime();
        }
    }
    protected _draw(): void {
        this._renderer.render(this._scene, this._persuingCamera.getMesh() as PerspectiveCamera);
    }
    public startTime(): void {
        console.log("start time", Date.now());
        this._clock = new Clock();
        this._clock.start();
        this._renderer.setAnimationLoop(this.tick.bind(this));
    }
    public stopTime(): void {
        console.log("stop time",Date.now());
        this._clock.stop();
        this._prevTime = 0;
        this._renderer.setAnimationLoop(null);
    }
    protected _getElapsedTime(): number {
        // console.log(this._clock.getElapsedTime())
        return this._clock.getElapsedTime();
    }
    protected _getDelta(): number {
        return this._clock.getDelta();
    }

    public getCamera():PerspectiveCamera{
        return this._persuingCamera.getMesh() as PerspectiveCamera;
    }

    public getScene():Scene{
        return this._scene;
    }

}