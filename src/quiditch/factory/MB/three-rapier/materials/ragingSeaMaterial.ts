import { Color, ShaderMaterial, Texture, Vector2 } from "three";
import { ITickable } from "../../../../../engine/base/ITickable";
import vertex from "../shaders/water/vertex.glsl";
import fragment from "../shaders/water/fragment.glsl";
import GUI from 'lil-gui'
export class RagingSeaMaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;
    public readonly gui: GUI = new GUI({
        width: 300,
        title: "Nice"
    });
    constructor (texture:Texture){
        
      
        this._shaderMaterial = new ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:fragment,
            side:2,
            uniforms:
            {
                uBigWavesElevation:{  
                          value:0.2
                },
                uBigWavesFrequency:{
                    value:new Vector2(3,1.5)
                }
                
            }
        })
        this.gui.add(this._shaderMaterial.uniforms.uBigWavesElevation,'value')
        .min(0).max(1).step(0.001).name('uBigWavesElevation')
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        //this._shaderMaterial.uniforms.uTime.value = elapsedTime
    }
    public getMaterial():ShaderMaterial{
        return this._shaderMaterial;
    }
    
}