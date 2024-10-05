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
        const debugObject = {
            depthColor: "#186691",
            surfaceColor: "#9bd8ff"
        }

        this._shaderMaterial = new ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:fragment,
            side:2,
            uniforms:
            {
                uTime:{value:0},

                uBigWavesSpeed:{value:0.75},
                uBigWavesElevation:{   value:0.25 },
                uBigWavesFrequency:{value:new Vector2(2,0.7) },
                
                uSmallWavesElevation:{   value:0.13 },
                uSmallWavesFrequency:{value:1.4 },
                uSmallWavesSpeed:{value:0.3},
                uSmallWavesIterations:{value:3},
                
                uDepthColor:{value:new Color(debugObject.depthColor)},
                uSurfaceColor:{value:new Color(debugObject.surfaceColor)},
                uColorOffset:{value:0.5},
                uColorMultiplier:{value:1.3},


                
            }
        })
        this.gui.add(this._shaderMaterial.uniforms.uBigWavesElevation,'value')
        .min(0).max(1).step(0.001).name('uBigWavesElevation')
        this.gui.add(this._shaderMaterial.uniforms.uBigWavesFrequency.value,'x')
        .min(0).max(10).step(0.001).name('uBigWavesFrequency.x')
        this.gui.add(this._shaderMaterial.uniforms.uBigWavesFrequency.value,'y')
        .min(0).max(10).step(0.001).name('uBigWavesFrequency.y')

        this.gui.add(this._shaderMaterial.uniforms.uBigWavesSpeed,'value')
        .min(0).max(10).step(0.001).name('uBigWavesSpeed')

        this.gui.addColor(debugObject, 'depthColor').name('depthColor')
            .onChange(
                () => this._shaderMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
            )
        this.gui.addColor(debugObject, 'surfaceColor').name('surfaceColor')
            .onChange(
                () => this._shaderMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
            )
        this.gui.add(this._shaderMaterial.uniforms.uColorOffset, 'value')
            .min(0).max(1).step(0.001).name('uColorOffset')
        this.gui.add(this._shaderMaterial.uniforms.uColorMultiplier, 'value')
            .min(0).max(10).step(0.001).name('uColorMultiplier')

            this.gui.add(this._shaderMaterial.uniforms.uSmallWavesElevation, 'value')
            .min(0).max(1).step(0.001).name('uSmallWavesElevation')
            this.gui.add(this._shaderMaterial.uniforms.uSmallWavesFrequency, 'value')
            .min(0).max(10).step(0.001).name('uSmallWavesFrequency')

            this.gui.add(this._shaderMaterial.uniforms.uSmallWavesSpeed, 'value')
            .min(0).max(1).step(0.001).name('uSmallWavesSpeed')

            this.gui.add(this._shaderMaterial.uniforms.uSmallWavesIterations, 'value')
            .min(0).max(10).step(1).name('uSmallWavesIterations')



    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._shaderMaterial.uniforms.uTime.value = elapsedTime
    }
    public getMaterial():ShaderMaterial{
        return this._shaderMaterial;
    }
    
}