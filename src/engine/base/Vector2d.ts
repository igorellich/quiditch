export class Vector2d{
    x:number;
    y: number;
    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }
    angleTo( v:Vector2d ) {

		const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

		if ( denominator === 0 ) return Math.PI / 2;

		const theta = this.dot( v ) / denominator;

		// clamp, to handle numerical problems

		return Math.acos( this.clamp( theta, - 1, 1 ) );

	}
    lengthSq() {

		return this.x * this.x + this.y * this.y;

	}
    dot( v:Vector2d ) {

		return this.x * v.x + this.y * v.y;

	}
    clamp( value:number, min:number, max:number ) {

        return Math.max( min, Math.min( max, value ) );
    
    }
    distanceTo( v:Vector2d ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared( v:Vector2d ) {

		const dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	}
	multiplyScalar( scalar:number ) {

		this.x *= scalar;
		this.y *= scalar;

		return this;

	}
	normalize() {

		return this.divideScalar( this.length() || 1 );

	}
	divideScalar( scalar:number ) {

		return this.multiplyScalar( 1 / scalar );

	}
	length() {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	}

}