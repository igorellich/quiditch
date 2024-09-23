export class Vector2d{
    private readonly _x:number;
    private readonly _y: number;
	public get x(){
		return this._x;
	}
	public get y(){
		return this._y;
	}
    constructor(x:number, y:number){
        this._x = x;
        this._y = y;
    }
    angleTo( v:Vector2d ) {

		const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

		if ( denominator === 0 ) return Math.PI / 2;

		const theta = this.dot( v ) / denominator;

		// clamp, to handle numerical problems

		return Math.acos( this.clamp( theta, - 1, 1 ) );

	}
    lengthSq() {

		return this._x * this._x + this._y * this._y;

	}
    dot( v:Vector2d ) {

		return this._x * v._x + this._y * v._y;

	}
    clamp( value:number, min:number, max:number ) {

        return Math.max( min, Math.min( max, value ) );
    
    }
    distanceTo( v:Vector2d ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared( v:Vector2d ) {

		const dx = this._x - v._x, dy = this._y - v._y;
		return dx * dx + dy * dy;

	}
	multiplyScalar( scalar:number ) {

		const x =  this._x * scalar;
		const y =  this._y * scalar;

		return new Vector2d(x,y);

	}
	normalize() {

		return this.divideScalar( this.length() || 1 );

	}
	divideScalar( scalar:number ) {

		return this.multiplyScalar( 1 / scalar );

	}
	length() {

		return Math.sqrt( this._x * this._x + this._y * this._y );

	}

}