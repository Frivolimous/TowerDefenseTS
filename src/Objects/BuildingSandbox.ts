class BuildingObject extends GameObject{
	tile:JMTile;
	speed:number=4;	
	cooldown:number=50;
	maxCooldown:number=50;
	range:number=100;
	damage:number=5;
	effects:Array<EffectModel>=[];
	subtype:BuildingType;
	activeFunction:Function;
	goa:TwoOptions=TwoOptions.Both;
	checkPriorities:Function=this.getClosest;
	priority:PriorityType=PriorityType.CLOSEST;

	static nameFromType(_type:BuildingType):string{
		switch(_type){
			case BuildingType.BASIC: return "Basic";
			case BuildingType.NOVA: return "Nova";
			case BuildingType.ICE: return "Ice";
			case BuildingType.POISON: return "Poison";
			case BuildingType.WALL: return "Wall";
		}
		return "NOT BUILDING";
	}

	static buildingFromType(_type:BuildingType,_tile:JMTile){
		switch(_type){
			case BuildingType.BASIC: return new BuildingObject(_tile);
			case BuildingType.NOVA: return new NovaBuilding(_tile);
			case BuildingType.ICE: return new IceBuilding(_tile);
			case BuildingType.POISON: return new PoisonBuilding(_tile);
			case BuildingType.WALL: return new WallBuilding(_tile);
		}
		return null;
	}

	constructor(_tile:JMTile,_texture:PIXI.Texture=null,_tint:number=0){
		super(_texture || TextureData.mediumCircle);
		this.type=ObjectType.BUILDING;
		this.tile=_tile;
		this.setTint(_tint || 0x0000cc);
		this.pivot.set(this.width/2,this.height/2);
		this.draggable=false;
		this.subtype=BuildingType.BASIC;
		this.activeFunction=this.shootProjectile;
		this.setPriority(PriorityType.FIRST);
	}

	activate=(manager:ObjectManager)=>{
		if (this.cooldown<0){
		//	console.log(this.checkPriorities);
			let _target:WalkingObject=this.checkPriorities(manager);
			if (_target!=null){
				this.cooldown=this.maxCooldown;
				this.activeFunction(_target,manager);
			}
		}else{
			this.cooldown-=1;
		}
	}

	setPriority=(i:PriorityType)=>{
		this.priority=i;

		switch (i){
			case PriorityType.FIRST: this.checkPriorities=this.getFirst; break;
			case PriorityType.LAST: this.checkPriorities=this.getLast; break;
			case PriorityType.CLOSEST: this.checkPriorities=this.getClosest; break;
			case PriorityType.STRONGEST: this.checkPriorities=this.getStrongest; break;
			case PriorityType.WEAKEST: this.checkPriorities=this.getWeakest; break;
			case PriorityType.ANY: this.checkPriorities=this.getAny; break;
			case PriorityType.NONE: this.checkPriorities=null; break;
		}
	}

	getAny(manager:ObjectManager):WalkingObject{
		let options:any={has:{type:ObjectType.WALKING},greater:{reserveHealth:0}};
		if (this.goa==TwoOptions.One){
			options.has.airborne=false;
		}else if (this.goa==TwoOptions.Two){
			options.has.airborne=true;
		}
		
		return (manager.getFirstObject(this.asPoint,this.range,options) as WalkingObject);
	}

	getClosest(manager:ObjectManager):WalkingObject{
		let options:any={has:{type:ObjectType.WALKING},greater:{reserveHealth:0}};
		if (this.goa==TwoOptions.One){
			options.has.airborne=false;
		}else if (this.goa==TwoOptions.Two){
			options.has.airborne=true;
		}
		return (manager.getClosestObject(this.asPoint,this.range,options) as WalkingObject);
	}

	getFirst(manager:ObjectManager):WalkingObject{
		let options:any={has:{type:ObjectType.WALKING},greater:{reserveHealth:0}};
		if (this.goa==TwoOptions.One){
			options.has.airborne=false;
		}else if (this.goa==TwoOptions.Two){
			options.has.airborne=true;
		}
		let _objects:Array<WalkingObject>=(manager.getAllInRange(this.asPoint,this.range,options) as Array<WalkingObject>);
		if (_objects.length==0) return null;
		let m:WalkingObject=_objects[0];
		let j:number=_objects[0].airborne?_objects[0].currentTile.airRating:_objects[0].currentTile.rating;
		for (var i:number=0;i<_objects.length;i+=1){
			let cJ:number=_objects[i].airborne?_objects[i].currentTile.airRating:_objects[i].currentTile.rating;
			if (cJ<j) m=_objects[i];
		}

		return m;
	}

	getLast(manager:ObjectManager):WalkingObject{
		let options:any={has:{type:ObjectType.WALKING},greater:{reserveHealth:0}};
		if (this.goa==TwoOptions.One){
			options.has.airborne=false;
		}else if (this.goa==TwoOptions.Two){
			options.has.airborne=true;
		}
		let _objects:Array<WalkingObject>=(manager.getAllInRange(this.asPoint,this.range,options) as Array<WalkingObject>);
		if (_objects.length==0) return null;
		let m:WalkingObject=_objects[0];
		let j:number=_objects[0].airborne?_objects[0].currentTile.airRating:_objects[0].currentTile.rating;
		for (var i:number=0;i<_objects.length;i+=1){
			let cJ:number=_objects[i].airborne?_objects[i].currentTile.airRating:_objects[i].currentTile.rating;
			if (cJ>j) m=_objects[i];
		}

		return m;
	}

	getStrongest(manager:ObjectManager):WalkingObject{
		let options:any={has:{type:ObjectType.WALKING},greater:{reserveHealth:0}};
		if (this.goa==TwoOptions.One){
			options.has.airborne=false;
		}else if (this.goa==TwoOptions.Two){
			options.has.airborne=true;
		}
		let _objects:Array<WalkingObject>=(manager.getAllInRange(this.asPoint,this.range,options) as Array<WalkingObject>);
		if (_objects.length==0) return null;
		let m:WalkingObject=_objects[0];
		let j:number=_objects[0].reserveHealth;
		for (var i:number=0;i<_objects.length;i+=1){
			let cJ:number=_objects[i].reserveHealth;
			if (cJ>j) m=_objects[i];
		}

		return m;
	}

	getWeakest(manager:ObjectManager):WalkingObject{
		let options:any={has:{type:ObjectType.WALKING},greater:{reserveHealth:0}};
		if (this.goa==TwoOptions.One){
			options.has.airborne=false;
		}else if (this.goa==TwoOptions.Two){
			options.has.airborne=true;
		}
		let _objects:Array<WalkingObject>=(manager.getAllInRange(this.asPoint,this.range,options) as Array<WalkingObject>);
		if (_objects.length==0) return null;
		let m:WalkingObject=_objects[0];
		let j:number=_objects[0].reserveHealth;
		for (var i:number=0;i<_objects.length;i+=1){
			let cJ:number=_objects[i].reserveHealth;
			if (cJ<j) m=_objects[i];
		}

		return m;
	}

	shootProjectile(_target:WalkingObject,manager:ObjectManager){
		let _bullet=new ProjectileObject(_target,{damage:this.damage,range:this.range,speed:this.speed,effects:this.effects,goa:this.goa});
		_bullet.goto(this.x,this.y);
		manager.addObject(_bullet);
	}

	shootNova(_target:WalkingObject,manager:ObjectManager){
		let _bullet=new ExpandingNova(_target,{damage:this.damage,range:this.range,speed:this.speed,effects:this.effects,goa:this.goa});
		_bullet.goto(this.x,this.y);
		manager.addObject(_bullet);
	}

	selectionCircle:PIXI.Graphics;

	onSelect(){
		this.selected=true;
		if (this.selectionCircle==null){
			this.selectionCircle=new PIXI.Graphics;
			this.selectionCircle.lineStyle(4,0x00cccc);
			this.selectionCircle.drawRect(-this.width/2-2,-this.height/2-2,this.width+4,this.height+4);
			if (this.range>0){
				this.selectionCircle.beginFill(0x00ffff,0.3);
				this.selectionCircle.lineStyle(2,0x00ffff,0.7);
				this.selectionCircle.drawCircle(0,0,this.range);
			}
			this.parent.addChild(this);
			this.addChild(this.selectionCircle);
			this.selectionCircle.x=this.pivot.x;
			this.selectionCircle.y=this.pivot.y;
		}
	}

	clearSelect(){
		this.selected=false;
		if (this.selectionCircle!=null){
			this.selectionCircle.parent.removeChild(this.selectionCircle);
			this.selectionCircle.destroy();
			this.selectionCircle=null;
		}
	}
}

class NovaBuilding extends BuildingObject{
	constructor(_tile:JMTile){
		super(_tile,TextureData.nova,0xcccc00);
		this.range=50;
		this.damage=2;
		this.maxCooldown=20;
		this.subtype=BuildingType.NOVA;
		this.activeFunction=this.shootNova;
		this.goa=TwoOptions.One;
		this.setPriority(PriorityType.ANY);
	}
}

class WallBuilding extends BuildingObject{
	constructor(_tile:JMTile){
		super(_tile,TextureData.wall,0x0000cc);
		this.range=0;
		this.damage=0;
		this.maxCooldown=0;
		this.subtype=BuildingType.WALL;
		this.activeFunction=null;
		this.setPriority(PriorityType.NONE);
	}

	activate=(manager:ObjectManager)=>{

	}
}

class IceBuilding extends BuildingObject{
	constructor(_tile:JMTile){
		super(_tile,TextureData.mediumCircle,0x00dddd);
		this.damage=4;
		this.range=70;
		this.maxCooldown=70;
		this.subtype=BuildingType.ICE;
		this.effects.push(new EffectBuff(new SlowBuff(0.5,100)));
		this.setPriority(PriorityType.FIRST);
	}
}

class PoisonBuilding extends BuildingObject{
	constructor(_tile:JMTile){
		super(_tile,TextureData.mediumCircle,0x007700);
		this.damage=2;
		this.range=90;
		this.maxCooldown=50;
		this.subtype=BuildingType.POISON;
		this.effects.push(new EffectBuff(new PoisonBuff(1,20,100)));
		this.setPriority(PriorityType.LAST);
	}
}