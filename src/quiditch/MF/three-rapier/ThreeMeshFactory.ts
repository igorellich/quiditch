import { ConeGeometry, Mesh, MeshBasicMaterial, Scene, SphereGeometry } from "three";
import { IMesh } from "../../../engine/MF/IMesh";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { ThreeBasedMesh } from "../../../engine/MF/three/ThreeBasedMesh";

export class ThreeMeshFactory implements IQuiditchFactory<IMesh>{
    private readonly _scene:Scene;
    private readonly _zHeight: number;
    constructor(scene:Scene, zHeight: number){
        this._scene = scene;
        this._zHeight = zHeight;
    }
    async createBall(): Promise<IMesh> {
        const mesh = this._createBallrMesh();
        this._scene.add(mesh);
        mesh.position.z = this._zHeight;
        return new ThreeBasedMesh(mesh);
    }
    async createPlayer(): Promise<IMesh> {
        const mesh = this._createPlayerMesh();
        this._scene.add(mesh);
        mesh.position.z = this._zHeight;
        return new ThreeBasedMesh(mesh);
    }
    private _createPlayerMesh():Mesh{
        return new Mesh(new ConeGeometry(0.2, 2, 16), new MeshBasicMaterial({
            color: 'black'
        }));
    }
    private _createBallrMesh():Mesh{
        return new Mesh(new SphereGeometry(0.5,16,32), new MeshBasicMaterial({
            color: 'pink'
        }));
    }
    
}