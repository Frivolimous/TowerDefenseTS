enum FlashMode{
	STANDARD,
	QUICK,
	DELAYED,
	DOUBLE,
}

enum ObjectType{
	BASIC,
}

class ObjectManager{
	private stage:any;
	private objects:Array<GameObject>=[];

	constructor(_stage:any){
		this.stage=_stage;
	}

	numObjects(){
		return this.objects.length;
	}

	getObjectAt(i:number){
		return this.objects[i];
	}

	getObjectIndex(_object:GameObject){
		for (var i:number=0;i<this.objects.length;i+=1){
			if (this.objects[i]==_object){
				return i;
			}
		}
	}

	addObject(_object:GameObject,_top:boolean=true){
		if (_top){
			this.stage.addChild(_object);
		}else{
			this.stage.addChildAt(_object,0);
		}
		this.objects.push(_object);
		return _object;
	}

	removeObject(_object:GameObject):GameObject{
		return this.removeObjectAt(this.getObjectIndex(_object));
	}

	removeObjectAt(i:number):GameObject{
		let _object:GameObject=this.objects[i];
		if (_object.parent!=null) _object.parent.removeChild(_object);
		this.objects.splice(i,1);
		return _object;
	}

	getAllInRange(point:PIXI.Point,maxDist:number,filter:ClosestProperties={}):Array<GameObject>{
		var m:Array<GameObject>=[];
		
		main:for (var i=0;i<this.objects.length;i+=1){
			let _object:any=this.objects[i];
			if (filter.notThis!=null && filter.notThis==_object) continue main;
			if (filter.has!=null){
				for (let v in filter.has){
					if (_object[v]!=filter.has[v]) continue main;
				}
			}
			if (filter.greater!=null){
				for (let v in filter.greater){
					if (_object[v]<=filter.greater[v]) continue main;
				}
			}
			if (filter.less!=null){
				for (let v in filter.less){
					if (_object[v]>=filter.less[v]) continue main;
				}
			}
			if (filter.not!=null){
				for (let v in filter.not){
					if (_object[v]==filter.not[v]) continue main;
				}
			}
			if (!_object.interactive) continue;
			let _distance:number=_object.getNowDistance(point);
			if (_distance<=maxDist){
				m.push(_object);
			}
		}
		return m;
	}

	getFirstObject(point:PIXI.Point,maxDist:number,filter:ClosestProperties={}):GameObject{
		main:for (var i=0;i<this.objects.length;i+=1){
			let _object:any=this.objects[i];
			if (filter.notThis!=null && filter.notThis==_object) continue main;
			if (filter.has!=null){
				for (let v in filter.has){
					if (_object[v]!=filter.has[v]) continue main;
				}
			}
			if (filter.greater!=null){
				for (let v in filter.greater){
					if (_object[v]<=filter.greater[v]) continue main;
				}
			}
			if (filter.less!=null){
				for (let v in filter.less){
					if (_object[v]>=filter.less[v]) continue main;
				}
			}
			if (filter.not!=null){
				for (let v in filter.not){
					if (_object[v]==filter.not[v]) continue main;
				}
			}
			if (!this.objects[i].interactive) continue;

			if (this.objects[i].getNowDistance(point)<=maxDist){
				return this.objects[i];
			}
		}
		return null;
	}

	getClosestObject(point:PIXI.Point,maxDist:number,filter:ClosestProperties={}):GameObject{
		var m:GameObject=null;
		var _distance:number=maxDist;
		var _distance2:number=0;
		
		main:for (var i=0;i<this.objects.length;i+=1){
			let _object:any=this.objects[i];
			if (filter.notThis!=null && filter.notThis==_object) continue main;
			if (filter.has!=null){
				for (let v in filter.has){
					if (_object[v]!=filter.has[v]) continue main;
				}
			}
			if (filter.greater!=null){
				for (let v in filter.greater){
					if (_object[v]<=filter.greater[v]) continue main;
				}
			}
			if (filter.less!=null){
				for (let v in filter.less){
					if (_object[v]>=filter.less[v]) continue main;
				}
			}
			if (filter.not!=null){
				for (let v in filter.not){
					if (_object[v]==filter.not[v]) continue main;
				}
			}
			if (!this.objects[i].interactive) continue;

			_distance2=this.objects[i].getNowDistance(point);
			if (_distance2<=_distance){
				_distance=_distance2;
				m=this.objects[i];
			}
		}
		return m;
	}

	removeAll(){
		while(this.objects.length>0){
			this.removeObjectAt(0);
		}
	}

	forEach(_function:Function){
		for (var i:number=0;i<this.objects.length;i+=1){
			_function.call(this.objects[i]);
		}
	}

	updateAll=()=>{
		for (var i:number=0;i<this.objects.length;i+=1){
			if (this.objects[i].toRemove){
				this.removeObjectAt(i);
				i-=1;
			}else{
				this.objects[i].update();
			}
		}
	}
}

interface ClosestProperties{
	notThis?:GameObject;
	has?:any;
	not?:any;
	greater?:any;
	less?:any;
}

class GameObject extends PIXI.Sprite{
	baseTint:number=0xffffff;
	goal:PIXI.Point=new PIXI.Point(0,0);
	eventRegisters:Array<JMERegister>=[];
	type:ObjectType=ObjectType.BASIC;
	moving:boolean=false;
	selected:boolean=false;

	draggable:boolean=true;
	dragging:boolean=false;
	clickable:boolean=true;
	toRemove:boolean=false;
	tweenSpeed:number=0.3;

	get asPoint():PIXI.Point{
		return new PIXI.Point(this.x,this.y);
	}

	addEventListener(_type:ObjectEvent,_function:Function,_once:Boolean=false){
		if (this.eventRegisters[_type]==null) this.eventRegisters[_type]=new JMERegister(_type);
		if (_once){
			this.eventRegisters[_type].once.push(_function);
		}else{
			this.eventRegisters[_type].listeners.push(_function);
		}
	}

	publishEvent(_type:ObjectEvent,_par:any){
		if (this.eventRegisters[_type]!=null) JME.publishSelfEvent(this.eventRegisters[_type],_par);
	}

	constructor(_texture:any=null){
		super(_texture);
		this.interactive=true;
		this.buttonMode=true;
		
	}

	setTint(_color:number){
		this.baseTint=_color;
		this.tint=_color;
	}

	onSelect(){

	}

	clearSelect(){

	}

	getDistance(p:PIXI.Point):number{
		let dX:number=p.x-this.goal.x;
		let dY:number=p.y-this.goal.y;

		if (dX>this.width) dX-=this.width;
		else if (dX>0) dX=0;
		if (dY>this.height) dY-=this.height;
		else if (dY>0) dY=0;

		return Math.sqrt(dX*dX+dY*dY);
	}

	getNowDistance(p:PIXI.Point):number{
		return Math.sqrt((this.x-p.x)*(this.x-p.x)+(this.y-p.y)*(this.y-p.y));
	}

	goto(x:number,y:number){
		this.goal.set(x,y);

		this.x=x;
		this.y=y;
	}

	tweenTo(x:number,y:number,_output:Function=null){
		this.goal.set(x,y);
		if (_output!=null){
			this.addEventListener(ObjectEvent.END_TWEEN,_output,true);
		}
	}

	get tweening():Boolean{
		if (this.goal.x!=this.x || this.goal.y!=this.y) return true;
		return false;
	}

	update=()=>{
		let _static:Boolean=true;
		if (this.x!=this.goal.x){
			let diff:number=this.goal.x+-this.x;
			if (Math.abs(diff)<1) this.x=this.goal.x;
			else {
				this.x+=diff*this.tweenSpeed;
				_static=false;
				this.moving=true;
			}
		}
		if (this.y!=this.goal.y){
			let diff:number=this.goal.y-this.y;
			if (Math.abs(diff)<1) this.y=this.goal.y;
			else{
				 this.y+=diff*this.tweenSpeed;
				_static=false;
				this.moving=true;
			}
		}

		if (_static && this.moving){
			this.moving=false;
			this.publishEvent(ObjectEvent.END_TWEEN,new JME_TweenEnd(this));
		}
	}
	select(b:Boolean=true){
		if (b){
			//draw outline?
		}else{
			//remove outline?
		}
	}

	dispose(){
		this.toRemove=true;
	}

	onWheel(_delta:Number){

	}

	colorFlash(_color:number=-1,_mode:FlashMode=FlashMode.STANDARD){
		if (_color<0) _color=0xff0000;

		switch(_mode){
			case FlashMode.QUICK:
				JMBL.tweenColor(this,4,{tint:_color},function(){
					JMBL.tweenColor(this,6,{delay:10,tint:this.baseTint});
				});
				break;
			case FlashMode.STANDARD:
				JMBL.tweenColor(this,8,{tint:_color},function(){
					JMBL.tweenColor(this,12,{delay:20,tint:this.baseTint});
				});
				break;
			case FlashMode.DOUBLE:
				JMBL.tweenColor(this,1,{tint:_color},function(){
					JMBL.tweenColor(this,4,{tint:this.baseTint},function(){
						JMBL.tweenColor(this,5,{delay:4,tint:_color},function(){
							JMBL.tweenColor(this,12,{delay:14,tint:this.baseTint});
						});
					});
				});
				break;
			case FlashMode.DELAYED:
				JMBL.tweenColor(this,7,{delay:32,tint:_color},function(){
					JMBL.tweenColor(this,10,{delay:25,tint:this.baseTint});
				});
				break;
		}
	}
}