interface ProjectileOptions{
	speed?:number,
	damage?:number,
	range?:number,
	effects?:Array<EffectModel>,
	goa?:TwoOptions,
}

class DamagingObject extends GameObject{
	speed:number=4;
	damage:number=5;
	range:number=30;
	goa:TwoOptions=TwoOptions.Both;
	effects:Array<EffectModel>;

	constructor(_texture:PIXI.Texture,options:ProjectileOptions={}){
		super(_texture);
		this.type=ObjectType.PROJECTILE;

		this.speed=options.speed || this.speed;
		this.damage=options.damage || this.damage;
		this.range=options.range || this.range;
		this.goa=options.goa!=null?options.goa:this.goa;
		this.pivot.set(this.width/2,this.height/2);
		this.effects=options.effects || [];
	}

	hitTarget=()=>{
	}

	finishHit=(_target:WalkingObject)=>{
		_target.takeDamage(this.damage);
		if (this.effects.length>0){
			for (var i:number=0;i<this.effects.length;i+=1){
				this.effects[i].applyTo(_target);
			}
		}
	}

	makeUseless=()=>{
	}

	update=()=>{
		this.makeUseless();
		this.toRemove=true;
	}
}

class ExpandingNova extends DamagingObject{
	alreadyHit:Array<WalkingObject>=[];
	cRange:number;

	constructor(_target:WalkingObject,options:ProjectileOptions={}){
		super(TextureData.clearCircle,JMBL.applyDefaultOptions(options,{damage:2,range:50,speed:3}));
		this.cRange=5;
		this.width=this.height=this.cRange*2;
	}

	update=()=>{
		if (this.cRange>=this.range){
			this.makeUseless();
			this.toRemove=true;
		}else{
			this.cRange+=this.speed;
			this.width=this.height=this.cRange*2;
			let options:any={has:{type:ObjectType.WALKING}};
			
			if (this.goa==TwoOptions.One){
				options.has.airborne=false;
			}else if (this.goa==TwoOptions.Two){
				options.has.airborne=true;
			}
			let _inRange:Array<WalkingObject>=(facade.game.objects.getAllInRange(this.asPoint,this.cRange,options) as any);
			
			main:for (var i:number=0;i<_inRange.length;i+=1){
				for (var j:number=0;j<this.alreadyHit.length;j+=1){
					if (_inRange[i]==this.alreadyHit[j]){
						continue main;
					}
				}

				this.finishHit(_inRange[i]);
				new JMFirework({gravity:0.001,numParts:2,addTo:this.parent,x:_inRange[i].x,y:_inRange[i].y,size:2,color:0xcccc00,startVX:0.5,startVY:0.5});
				this.alreadyHit.push(_inRange[i]);
			}
		}
	}
}

class ProjectileObject extends DamagingObject{
	target:WalkingObject;
	cAngle:number=0;

	constructor(_target:WalkingObject,options:ProjectileOptions={}){
		super(TextureData.bullet,JMBL.applyDefaultOptions(options,{speed:4,damage:5}));
		this.target=_target;
		_target.reserveDamage(this.damage);
		this.addEventListener(ObjectEvent.END_TWEEN,this.hitTarget,true);
		this.setTint(0x003333);
	}

	hitTarget=()=>{
		this.finishHit(this.target);
		this.toRemove=true;
		new JMFirework({gravity:0.001,numParts:3,addTo:this.parent,x:this.target.x,y:this.target.y,size:2,color:0x0000cc,startVX:0.5,startVY:0.5});
	}

	makeUseless=()=>{
		this.target=null;
	}

	update=()=>{
		if (this.target==null){
			this.alpha-=0.02;
			if (this.alpha<=0) this.toRemove=true;
			this.x+=Math.cos(this.cAngle)*this.speed;
			this.y+=Math.sin(this.cAngle)*this.speed;
			return;
		}

		if (this.target.toRemove){
			this.makeUseless();
			return;
		}

		let distance:number=this.getNowDistance(this.target.asPoint);
		if (distance<=this.speed){
			this.moving=false;
			this.publishEvent(ObjectEvent.END_TWEEN,new JME_TweenEnd(this));
		}else{
			this.cAngle=Math.atan2(this.target.y-this.y,this.target.x-this.x);
			this.x+=Math.cos(this.cAngle)*this.speed;
			this.y+=Math.sin(this.cAngle)*this.speed;
		}
	}
}