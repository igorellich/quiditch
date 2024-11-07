import { AdditiveBlending, Color, Material, PointsMaterial, ShaderMaterial, Texture, Vector2 } from "three";
import { ITickable } from "../../../../../engine/base/ITickable";
import vertex from "../shaders/galaxy/vertex.glsl";
import fragment from "../shaders/galaxy/fragment.glsl";
export class GalaxyMaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;
    constructor(pixelRatio: number = 1.0) {
        this._shaderMaterial = new ShaderMaterial({

            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true,
            vertexShader: vertex,
            transparent:true,
            fragmentShader: fragment,
            uniforms:
            {
                uTime:{value:0},
                uSize: { value: 30 * pixelRatio }
            }
        })
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._shaderMaterial.uniforms.uTime.value = elapsedTime
    }
    public getMaterial():Material{
       
       return this._shaderMaterial;
    }
    
}