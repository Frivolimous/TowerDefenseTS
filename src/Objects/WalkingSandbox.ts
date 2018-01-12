class WalkingObject extends GameObject{
	currentTile:JMTile;
	nextTile:JMTile;
	maxHealth:number=100;
	health:number=100;
	reserveHealth:number=100;
	gauge:JMBUI_Gauge;
	originalTint:number;
	buffs:Array<BuffModel>=[];
	cBuffVisual:number=-1;
	cBuffCounter:number=0;
	speed:number=0.05;
	airborne:boolean=false;
	subtype:WalkingType=WalkingType.RUNNER;

	static nameFromType(_type:WalkingType):string{
		switch(_type){
			case WalkingType.RUNNER: return "Runner";
			case WalkingType.FLYER: return "Flyer";
		}
		return "NOT WALKER";
	}

	static buildingFromType(_type:WalkingType,_tile:JMTile){
		switch(_type){
			case WalkingType.RUNNER: return new WalkingObject(_tile);
			case WalkingType.FLYER: return new FlyingObject(_tile);
		}
		return null;
	}

	constructor(_tile:JMTile,_texture:PIXI.Texture=null,_tint:number=0){
		super(_texture || TextureData.smallCircle);
		this.type=ObjectType.WALKING;
		this.currentTile=_tile;
		this.setTint(_tint || 0xff0000);
		this.originalTint=this.baseTint;
		this.pivot.set(this.width/2,this.height/2);
		this.subtype=WalkingType.RUNNER;
	}

	reserveDamage(n:number){
		this.reserveHealth-=n;
	}

	takeDamage(n:number){
		this.health-=n;
		this.reserveHealth=Math.min(this.reserveHealth,this.health);
		if (this.health<this.maxHealth){
			if (this.gauge==null){
				this.gauge=new JMBUI_Gauge(0x00cc00,{width:15,height:2});
				this.gauge.x=this.pivot.x-this.gauge.graphics.width/2;
				this.gauge.y=-this.gauge.graphics.height-2;
				this.addChild(this.gauge);
				this.gauge.setMax(this.maxHealth);
			}
		}

		if (this.gauge!=null) this.gauge.setValue(this.health);
		if (this.health<=0){
			this.killMe();
			return;
		};

		JMBL.tweenColor(this,5,{tint:0},()=>{JMBL.tweenTo(this,5,{tint:this.baseTint})});
	}

	killMe=()=>{
		new JMFirework({gravity:0.001,numParts:7,addTo:this.parent,x:this.x,y:this.y,size:3,color:0xcc0000,startVX:0.5,startVY:0.5});
		this.toRemove=true;
	}

	updateNextTile=()=>{
		if (this.currentTile!=null){
			this.nextTile=null;
			if (this.currentTile.outlets.length>0){
				let _best:number=Infinity;
				for (var i=0;i<this.currentTile.outlets.length;i+=1){
					if (this.currentTile.outlets[i].rating>=0 && (this.currentTile.outlets[i].rating<_best || (this.currentTile.outlets[i].rating==_best && Math.random()<0.5))){
						_best=this.currentTile.outlets[i].rating;
						this.nextTile=this.currentTile.outlets[i];
					}
				}
				if (this.nextTile==null){
					this.nextTile=this.currentTile.outlets[Math.floor(Math.random()*this.currentTile.outlets.length)];
				}
			}
		}
	}

	update=()=>{
		if (this.dragging){
			this.currentTile=null;
		}else if (this.currentTile==null){

		}else{
			if (this.nextTile==null){
				this.updateNextTile();
			}else{
				this.goal.x=(this.nextTile.loc.x+0.5)*this.nextTile.width;
				this.goal.y=(this.nextTile.loc.y+0.5)*this.nextTile.width;

				if (this.nextTile.pointInTile(this.asPoint)){
					this.currentTile=this.nextTile;
					this.updateNextTile();
				}
			}
		}

		let _static:Boolean=true;

		if (this.x!=this.goal.x){
			let diff:number=this.goal.x+-this.x;
			if (Math.abs(diff)<1) this.x=this.goal.x;
			else {
				this.x+=diff*this.speed*(this.currentTile?this.currentTile.speed:1);
				_static=false;
				this.moving=true;
			}
		}
		if (this.y!=this.goal.y){
			let diff:number=this.goal.y-this.y;
			if (Math.abs(diff)<1) this.y=this.goal.y;
			else{
				 this.y+=diff*this.speed*(this.currentTile?this.currentTile.speed:1);
				_static=false;
				this.moving=true;
			}
		}

		if (_static && this.moving){
			this.moving=false;
			this.publishEvent(ObjectEvent.END_TWEEN,new JME_TweenEnd(this));
		}

		if (this.buffs.length>0){
			for (var i:number=0;i<this.buffs.length;i+=1){
				this.buffs[i].update();
				if (this.buffs[i].ticks<=0){
					this.removeBuffAt(i);
					i-=1;
				}
			}
		}

		this.incrementVisualBuff();
	}

	addBuff(_buff:BuffModel){
		for (var i:number=0;i<this.buffs.length;i+=1){
			if (this.buffs[i].type==_buff.type){
				this.buffs[i].mergeWith(_buff);
				return;
			}
		}
		this.buffs.push(_buff);
		_buff.addTo(this);
		if (this.cBuffVisual>=0) this.buffs[this.cBuffVisual].endVisual();
		this.setVisualBuff(this.buffs.length-1);
	}

	removeBuff(_buff:BuffModel):BuffModel{
		for (var i:number=0;i<this.buffs.length;i+=1){
			if (this.buffs[i]==_buff){
				return this.removeBuffAt(i);
			}
		}

		return null;
	}

	removeBuffAt(i:number):BuffModel{
		let _buff:BuffModel=this.buffs[i];
		this.buffs.splice(i,1);
		if (i==this.cBuffVisual){
			_buff.endVisual();
			if (this.buffs.length>=1) this.setVisualBuff(0);
			else{
				this.cBuffVisual=-1;
			}
		}else if (this.cBuffVisual>i) this.cBuffVisual-=1;
		_buff.onRemove();
		return _buff;
	}

	setVisualBuff(i:number){
		if (this.cBuffVisual>=0 && this.cBuffVisual<this.buffs.length) this.buffs[this.cBuffVisual].endVisual();
		this.cBuffVisual=i;
		this.cBuffCounter=1000;
		this.buffs[this.cBuffVisual].startVisual();
	}

	incrementVisualBuff(i:number=1){
		if (this.cBuffCounter<0){
			if (this.buffs.length>1){
				if (this.cBuffVisual>=0) this.buffs[this.cBuffVisual].endVisual();
				this.cBuffVisual+=i;
				this.cBuffCounter=1000;
				if (this.cBuffVisual>=this.buffs.length) this.cBuffVisual=0;
				this.buffs[this.cBuffVisual].startVisual();
			}
		}else{
			this.cBuffCounter-=1;
		}
	}

	selectionGraphics:PIXI.Graphics;

	onSelect(){
		this.selected=true;
		if (this.selectionGraphics==null){
			this.selectionGraphics=new PIXI.Graphics;
			this.selectionGraphics.lineStyle(2,0x00cccc);
			this.selectionGraphics.drawRect(-this.width/2-2,-this.height/2-2,this.width+4,this.height+4);
			
			this.addChild(this.selectionGraphics);
			this.selectionGraphics.x=this.pivot.x;
			this.selectionGraphics.y=this.pivot.y;
		}
	}

	clearSelect(){
		this.selected=false;
		if (this.selectionGraphics!=null){
			this.selectionGraphics.parent.removeChild(this.selectionGraphics);
			this.selectionGraphics.destroy();
			this.selectionGraphics=null;
		}
	}
}

class FlyingObject extends WalkingObject{
	shadow:PIXI.Sprite=new PIXI.Sprite(TextureData.genericShadow);

	constructor(_tile:JMTile){
		super(_tile);
		this.addChild(this.shadow);
		this.pivot.y=20;
		this.airborne=true;
		this.shadow.x=this.pivot.x-this.shadow.width/2;
		this.shadow.y=this.pivot.y-this.shadow.height/2;
		this.subtype=WalkingType.FLYER;
		this.maxHealth=this.health=50;
	}

	hoverCount:number=0;
	hoverMove(){
		this.hoverCount-=0.5+Math.random();
		if (this.hoverCount<-30){
			this.hoverCount=30;
		}
		this.pivot.y=20-Math.abs(this.hoverCount)/5;
		this.shadow.scale.x=this.shadow.scale.y=1+this.pivot.y/100;
		this.shadow.y=this.pivot.y+this.shadow.height/2;
		this.shadow.x=this.pivot.x-this.shadow.width/2;
	}

	updateNextTile=()=>{
		if (this.currentTile!=null){
			this.nextTile=null;
			if (this.currentTile.outlets.length>0){
				let _best:number=Infinity;
				for (var i=0;i<this.currentTile.outlets.length;i+=1){
					if (this.currentTile.outlets[i].airRating>=0 && (this.currentTile.outlets[i].airRating<_best || (this.currentTile.outlets[i].airRating==_best && Math.random()<0.5))){
						_best=this.currentTile.outlets[i].airRating;
						this.nextTile=this.currentTile.outlets[i];
					}
				}
				if (this.nextTile==null){
					this.nextTile=this.currentTile.outlets[Math.floor(Math.random()*this.currentTile.outlets.length)];
				}
			}
		}
	}

	update=()=>{
		if (this.currentTile!=null){
			if (this.nextTile==null){
				this.updateNextTile();
			}else{
				this.goal.x=(this.nextTile.loc.x+0.5)*this.nextTile.width;
				this.goal.y=(this.nextTile.loc.y+0.5)*this.nextTile.width;

				if (this.nextTile.pointInTile(this.asPoint)){
					this.currentTile=this.nextTile;
					this.updateNextTile();
				}
			}
		}

		let _static:Boolean=true;

		if (this.x!=this.goal.x){
			let diff:number=this.goal.x+-this.x;
			if (Math.abs(diff)<1) this.x=this.goal.x;
			else {
				this.x+=diff*this.speed;
				_static=false;
				this.moving=true;
			}
		}
		if (this.y!=this.goal.y){
			let diff:number=this.goal.y-this.y;
			if (Math.abs(diff)<1) this.y=this.goal.y;
			else{
				 this.y+=diff*this.speed;
				_static=false;
				this.moving=true;
			}
		}

		if (_static && this.moving){
			this.moving=false;
			this.publishEvent(ObjectEvent.END_TWEEN,new JME_TweenEnd(this));
		}

		if (this.buffs.length>0){
			for (var i:number=0;i<this.buffs.length;i+=1){
				this.buffs[i].update();
				if (this.buffs[i].ticks<=0){
					this.removeBuffAt(i);
					i-=1;
				}
			}
		}

		this.incrementVisualBuff();
		this.hoverMove();
	}
}