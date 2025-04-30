import { AmbientLight, Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IActor } from "@common/IActor";
import { SceneManager, Size } from "../SceneManager";
import { MeshBasedActor } from "../MeshBasedActor";
import { ThreeBasedMesh } from "./ThreeBasedMesh";


export class ThreeSceneManager extends SceneManager {
    setCameraTarget(target: IActor) {
        
        ((target as MeshBasedActor).getMesh() as ThreeBasedMesh).addCamera(this._camera, this._scene)
    }


    private readonly _renderer: WebGLRenderer;

    private _clock: Clock = new Clock();
    private _camera: PerspectiveCamera ;

    private readonly _scene: Scene;

    
    async tick() {
       await super.tick();

    }

    constructor(size: Size, canvas: HTMLCanvasElement, scene: Scene) {
        super(size);
        this._scene = scene;
        this._renderer = new WebGLRenderer({
            canvas: canvas,
            // antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            

        });
        
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._renderer.setSize(this._size.width, this._size.height);

        this._camera = new PerspectiveCamera(75, this._size.width / this._size.height,30, 60);      
        this._camera.position.z = 50;
        // this._camera.rotateZ(Math.PI/2);
       
                


        // const controls = new OrbitControls( this._camera, this._renderer.domElement);
        // controls.enableDamping = true;
        // controls.enableRotate=false;
        // controls.enabled = false;

        const light = new AmbientLight();
        scene.add(light);
        

        window.addEventListener('resize', () => {
            this._size.height = canvas.height;
            this._size.width = canvas.width;

            ( this._camera).aspect = this._size.width / this._size.height;
            ( this._camera).updateProjectionMatrix();

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
        this._renderer.render(this._scene, this._camera);
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
        return this._camera;
    }

    public getScene():Scene{
        return this._scene;
    }

}