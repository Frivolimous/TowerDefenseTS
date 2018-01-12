interface JMFireworkOptions{
	x?:number;
	y?:number;
	color?:number;
	gravity?:number;
	fade?:number;
	startVX?:number;
	startVY?:number;
	numParts?:number;
	size?:number;
	addTo?:any;
}

class JMFirework{
	static GRAVITY:number=0.01;
	static FADE:number=0.01;
	static START_V_Y:number=1;
	static START_V_X:number=1;
	static NUM_PARTS:number=50;
	static SIZE:number=3;

	static particles:Array<JMFireworkParticle>=[];
	static initialized:Boolean=false;

	static initialize(){
		if (!this.initialized){
			JME.addToTicker(this.onTick.bind(this));
			this.initialized=true;
		}
	}

	constructor(options:JMFireworkOptions=null){
		if (!JMFirework.initialized) JMFirework.initialize();

		options=options || {};

		options.x=options.x || 0;
		options.y=options.y || 0;
		options.color=options.color || 0xffffff;
		options.gravity=options.gravity || JMFirework.GRAVITY;
		options.fade=options.fade || JMFirework.FADE;
		options.startVX=options.startVX || JMFirework.START_V_X;
		options.startVY=options.startVY || JMFirework.START_V_Y;
		options.numParts=options.numParts || JMFirework.NUM_PARTS;
		options.size=options.size || JMFirework.SIZE;
		options.addTo=options.addTo || facade.app.stage;
		for (var i:number=0;i<options.numParts;i+=1){
			new JMFireworkParticle(options);
		}
	}

	static onTick(){

		for (var i=0;i<this.particles.length;i+=1){
			this.particles[i].update();
			if (this.particles[i].alpha<0.1){
				this.particles[i].destroy();
				this.particles.splice(i,1);
				i-=1;
			}
		}
		//if (this.particles.length>0) console.log(this.particles[0].x+" "+this.particles[0].y);
	}
}

class JMFireworkParticle extends PIXI.Sprite{
	gravity:number;
	fade:number;
	vX:number;
	vY:number;

	constructor(options:JMFireworkOptions){
		super(TextureData.firework);
		this.x=options.x;
		this.y=options.y;
		this.gravity=options.gravity;
		this.fade=options.fade;
		this.vX=Math.random()*options.startVX-options.startVX/2;
		this.vY=Math.random()*options.startVY-options.startVY/2;
		this.alpha=1;
		this.width=options.size;
		this.height=options.size;
		this.tint=options.color;
		JMFirework.particles.push(this);
		options.addTo.addChild(this);

	}

	update=()=>{
		this.x+=this.vX;
		this.y+=this.vY;
		this.vY+=this.gravity;
		this.alpha-=this.fade;
	}
}