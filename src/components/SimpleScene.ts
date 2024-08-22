import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import GUI from 'lil-gui'
const stats = new Stats()
export default class SimpleScene extends THREE.Scene {


    private readonly renderer: THREE.WebGLRenderer;

    public readonly camera: THREE.PerspectiveCamera;

    private updateHandlers: ((elapsedTime: number, delta: number) => void)[] = [];

    private _clock: THREE.Clock = new THREE.Clock();

    public readonly gui: GUI = new GUI({
        width: 300,
        title: "Nice"
    });
    public readonly sizes: {
        width: number,
        height: number
    } = {
            width: window.innerWidth,
            height: window.innerHeight
        }

    public constructor(canvas: HTMLCanvasElement) {
        super();

        //this.background = new THREE.Color(0x777777);   
        
        document.body.appendChild(stats.dom)
        window.addEventListener('resize', () => {
            this.sizes.height = window.innerHeight;
            this.sizes.width = window.innerWidth;

            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        window.addEventListener('dblclick', () => {

            if (!document.fullscreenElement) {
                this.renderer.domElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        })

        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.z = 2;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.sizes.width, this.sizes.height);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = true;
    }

    public addUpdateHandler(handler: (elapsedTime: number, delta: number) => void) {
        this.updateHandlers.push(handler);
    }
    prevTime = 0;
    private draw() {
        stats.update()
        const elapsedTime = this._clock.getElapsedTime()
        const delta = elapsedTime - this.prevTime;
        this.prevTime = elapsedTime;
        for (const h of this.updateHandlers) {

            h(elapsedTime, delta);
        }

        this.renderer.render(this, this.camera);
    }

    public start() {
        this._clock = new THREE.Clock();
        this.renderer.setAnimationLoop(this.draw.bind(this));
    }

    public stop() {

        this.renderer.setAnimationLoop(null);
    }
}