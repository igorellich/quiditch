import { Camera, Group, Object3D, Scene } from "three";
import { IMesh } from "../IMesh";
import { Vector2d } from "@common/Vector2d";

export class ThreeBasedMesh implements IMesh{

    protected readonly _mesh:Object3D;
    private _cameraGroup:Group|undefined;
    constructor(mesh:Object3D){
        this._mesh = mesh;
    }
    public getMesh(){
        return this._mesh;
    }

    async setPosition(x: number, y: number): Promise<void> {
        if(!this._cameraGroup){
        this._mesh.position.set(x, y, this._mesh.position.z);
        }else{
            this._cameraGroup.position.set(x, y, this._cameraGroup.position.z);
        }
    }
    async getPosition(): Promise<Vector2d> {
        if(!this._cameraGroup){
            return new Vector2d(this._mesh.position.x,this._mesh.position.y);
        }
        return new Vector2d(this._cameraGroup.position.x,this._cameraGroup.position.y);
    }
    async setRotation(rotation: number): Promise<void> {
       this._mesh.rotation.z  = rotation;
    }
    async getRotation(): Promise<number> {
        return this._mesh.rotation.z;
    }
    public remove(scene:Scene){
        if(this._cameraGroup){
            scene.remove(this._cameraGroup)
        }else{
            scene.remove(this._mesh);
        }
    }
    addCamera(camera:Camera, scene:Scene){        
        this._cameraGroup = new Group();
        this._cameraGroup.add(this._mesh);
        this._cameraGroup.add(camera);
        this._cameraGroup.position.set(this._mesh.position.x, this._mesh.position.y, this._mesh.position.z);
        this._mesh.position.set(0, 0, 0);
        scene.add(this._cameraGroup);
        camera.updateMatrix();
        camera.updateMatrixWorld();
    }

}