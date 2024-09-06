import { BoxGeometry, ConeGeometry, Mesh, MeshBasicMaterial, Scene } from "three";
import { IMesh } from "../../../engine/MF/IMesh";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { ThreeBasedMesh } from "./ThreeBasedMesh";

export class ThreeMeshFactory implements IQuiditchFactory<IMesh>{
    private readonly _scene:Scene;
    private readonly _zHeight: number;
    constructor(scene:Scene, zHeight: number){
        this._scene = scene;
        this._zHeight = zHeight;
    }
    async createPlayer(): Promise<IMesh> {
        const mesh = this._createPlayerMesh();
        this._scene.add(mesh);
        mesh.position.z = this._zHeight;
        return new ThreeBasedMesh(mesh);
    }
    private _createPlayerMesh():Mesh{
        return new Mesh(new BoxGeometry(2, 6, 16), new MeshBasicMaterial({
            color: 'red'
        }));
    }
    
}