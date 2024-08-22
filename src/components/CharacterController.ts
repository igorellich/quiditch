import RAPIER from "@dimforge/rapier2d";
import { PhysicsMesh, PhysicsMeshArgs } from "./PhysicsMesh";
import { ConeGeometry, Mesh, MeshBasicMaterial } from "three";

export class CharacterController extends PhysicsMesh {

    
    private _characterController: RAPIER.KinematicCharacterController | undefined;
    private _characterCollider: RAPIER.Collider | undefined;
    private _characterMesh: Mesh | undefined;
    private _characterArgs: CharacterArgs;

    constructor(argsObj: PhysicsMeshArgs, charArgs: CharacterArgs) {
        super(argsObj);
        this._characterArgs = charArgs;

    }

    public update(): void {
        if (this.body && this._characterController && this._characterCollider && this._characterMesh) {
            this.body.setRotation(this.body.rotation() + this._characterArgs.rotationSpeed, false);
            const directionVector = new RAPIER.Vector2(
                -Math.sin(this.body.rotation()) * this._characterArgs.speed,
                Math.cos(this.body.rotation()) * this._characterArgs.speed
            )

            //console.log(rotation)

            this._characterController.computeColliderMovement(this._characterCollider,
                directionVector, undefined, this._filterGroups
            );

            const movement = this._characterController.computedMovement();
            this._characterController.setApplyImpulsesToDynamicBodies(true)
            const newPos = this.body.translation();
            newPos.x += movement.x;
            newPos.y += movement.y;
            this.body.setNextKinematicTranslation(newPos);
            //console.log("character.translation",characterBody.translation())
            this._characterMesh.position.x = this.body.translation().x;
            this._characterMesh.position.y = this.body.translation().y;
            this._characterMesh.rotation.z = this.body.rotation();
        }
    }

    protected _build(): void {
        // Character.
        const characterMesh = new Mesh(new ConeGeometry(0.2, 2, 16), new MeshBasicMaterial({
            color: 'black'
        }));

        characterMesh.position.set(this._translation.x, this._translation.y, this._zHeight)

        this._scene.add(characterMesh);

        this._characterController = this._world.createCharacterController(0.1);
        let characterDesc =
            RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(this._translation.x, this._translation.y);
        this.body = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = RAPIER.ColliderDesc.ball(0.4)
        this._characterCollider = this._world.createCollider(
            characterColliderDesc,
            this.body,
        );

    }


}
export type CharacterArgs = {
    speed: number,
    rotationSpeed: number
}