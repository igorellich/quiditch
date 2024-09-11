import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { SceneManager, Size } from "../../base/SceneManager"
import { IPhysicsManager } from "../../base/IPhysicsManager";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Actor } from "../../base/Actor";
import { Vector2d } from "../../base/Vector2d";

export class ThreeSceneManager extends SceneManager{   
   

    private readonly _renderer: WebGLRenderer;

    private _clock: Clock = new Clock();

    private readonly _scene:Scene;

    private readonly _camera: PerspectiveCamera;

    constructor(size:Size, canvas: HTMLCanvasElement, scene: Scene,collisionManager?:IPhysicsManager){
        super(size, collisionManager);
        this._scene = scene;
        this._renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,

        });
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._renderer.setSize(this._size.width, this._size.height);

        this._camera = new PerspectiveCamera(75, this._size.width / this._size.height, 0.1, 100);
       
        // this._camera.position.z = 15
        // this._camera.rotation.x = Math.PI / 6
         this._camera.position.z = -13       

        const controls = new OrbitControls(this._camera, this._renderer.domElement);
        controls.enableDamping = true;

        window.addEventListener('resize', () => {
            this._size.height = window.innerHeight;
            this._size.width = window.innerWidth;

            this._camera.aspect = this._size.width / this._size.height;
            this._camera.updateProjectionMatrix();

            this._renderer.setSize(this._size.width, this._size.height);
            this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          
        });

        window.addEventListener('dblclick', () => {

            if (!document.fullscreenElement) {
                this._renderer.domElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        })

    }
    protected _draw(): void {
        this._renderer.render(this._scene, this._camera);
    }
    public startTime(): void {
        this._clock = new Clock();
        this._renderer.setAnimationLoop(this.tick.bind(this));
    }
    public stopTime(): void {
        this._renderer.setAnimationLoop(null);
    }
    protected _getElapsedTime(): number {
        return this._clock.getElapsedTime();
    }

}