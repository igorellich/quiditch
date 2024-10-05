import { AmbientLight, Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
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
        
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._renderer.setSize(this._size.width, this._size.height);

        const camera = new PerspectiveCamera(75, this._size.width / this._size.height, 0.1, 100);        
        camera.position.z = -10;
        camera.position.y = -20;
        
        
        
       

        this._persuingCamera = new PersuingCamera(camera, 7);
        this.addTickable(this._persuingCamera);
        

        const controls = new OrbitControls(camera, this._renderer.domElement);
        controls.enableDamping = true;
        // /controls.enableRotate=false;

        const light = new AmbientLight();
        scene.add(light);
        

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