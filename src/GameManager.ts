enum InteractionMode{
	SELECT,
	SELL,
	WALL,
	TURRET,
	NOVA,
	ICE,
	POISON,
}

class GameManager{
	objects:ObjectManager;
	//gameStage:PIXI.Sprite=new PIXI.Sprite();
	gameStage:PIXI.Container=new PIXI.Container();
	objectView:PIXI.Container=new PIXI.Container();
	tilemap:JMTileMap;
	selected:GameObject;
	gameUI:GameUI;
	interactionMode:number=0;

	running:boolean=true;

	spawnMax:number=60;
	spawnTick:number=-1;

	numTicks:number=0;

	playRect:JMBL_Rect;

	keyStates:any={
		left:false,
		right:false,
		up:false,
		down:false
	}

	private app:any;
	constructor(_app:any){
		this.app=_app;
		this.app.stage.addChild(this.gameStage);
		this.gameStage.addChild(this.objectView);
		this.objects=new ObjectManager(this.objectView);
		JME.addToTicker(this.onTick)
		JME.addEventListener(EventType.MOVE_EVENT,this.onMouseMove);
		JME.addEventListener(EventType.CLICK_EVENT,this.onClick);
		JME.addEventListener(EventType.DRAG_EVENT,this.onDrag);

		this.tilemap=new JMTileMap({tilesAcross:25,tilesDown:20,tileSize:30});
		this.tilemap.loadWalkMap("su-----------------------"+
								 "uu-----------------------"+
								 "uu-----------------xxxx--"+
								 "su------------------yyxx-"+
								 "uu-------------------xx--"+
								 "uu----xxxx---------------"+
								 "uu---xxxx---------------e"+
								 "su---xxxxx---------------"+
								 "uu----xxx----------------"+
								 "uu-----------------------"+
								 "su---------------yyx-----"+
								 "uu--------------yyyxx----"+
								 "uu---------------xxx-----"+
								 "su-----------------------"+
								 "uu-----------------------"+
								 "uu-----------------------"+
								 "uu-----------------------"+
								 "uu-----------------------"+
								 "uu-----------------------"+
								 "uu-----------------------"
								  );
		/*this.tilemap=new JMTileMap({tilesAcross:20,tilesDown:14,tileSize:30});
		this.tilemap.loadWalkMap("00000000000000000000"+
								 "suuuuuuuuuuuuuu00000"+
								 "000p000000000pup0000"+
								 "0000000p00000pup0000"+
								 "000000uuuuuuuuu00000"+
								 "00000pup00p000000000"+
								 "000000uuuuuu00000uue"+
								 "0000000000pup0000up0"+
								 "00000000p0pu00000u00"+
								 "00000000000u00000u00"+
								 "00000000000u00p00up0"+
								 "00000000000uuuuuuu00"+
								 "00000000000000p0p000"+
								 "00000000000000000000"
								  );*/
		this.gameStage.addChildAt(this.tilemap,0);
		this.gameUI=new GameUI;
		this.gameUI.addSelections([["Select",InteractionMode.SELECT],["Sell",InteractionMode.SELL],["Wall",InteractionMode.WALL],["Turret",InteractionMode.TURRET],["Nova",InteractionMode.NOVA],["Ice",InteractionMode.ICE],["Poison",InteractionMode.POISON]],(i:number)=>{this.interactionMode=i;});
		this.gameUI.selectButtonAt(0);
		this.app.stage.addChild(this.gameUI);
		JME.addEventListener(EventType.KEY_DOWN,this.onKeyDown);
		JME.addEventListener(EventType.KEY_UP,this.onKeyUp);
		this.playRect=this.gameUI.getPlayArea();
		this.gameStage.y=this.playRect.y;
	}

	clearGame(){

	}

	loadGame(_levelData:any){

	}

	onTick=()=>{
		if (this.running){
			this.objects.updateAll();
			let self:any=this;
			this.objects.forEach(function(){
				if (this.type==ObjectType.WALKING){
					let _object:WalkingObject=this;

					if (_object.currentTile!=null && _object.currentTile.rating==0){
						_object.toRemove=true;
					}
					if (_object.currentTile==null){
						_object.currentTile=self.tilemap.getTileAt(_object.goal);
					}
				}else if (this.type==ObjectType.BUILDING){
					this.activate(self.objects);
					//console.log(self);				
				}else if (this.type==ObjectType.PROJECTILE){
				
				}
			});

			this.spawnTick-=1;
			if (this.spawnTick<0){
				this.spawnTick=this.spawnMax;
				this.onSpawn();
			}
			let _children:Array<any>=this.objectView.children;
			_children.sort(function(a,b):number{
				if (a.type==ObjectType.BUILDING){
					if (b.type==ObjectType.BUILDING){
						if (a.selected) return 1;
						if (b.selected) return -1;
						if (a.y<b.y) return -1;
						if (b.y<a.y) return 1;
						return 0;
					}
					return -1;
				}else if (b.type==ObjectType.BUILDING) return 1;

				if (a.type==ObjectType.PROJECTILE){
					if (b.type==ObjectType.PROJECTILE) return 0;
				 	return -1;
				}else if (b.type==ObjectType.PROJECTILE){
					return 1;
				}

				if (a.y<b.y) return -1;
				if (b.y<a.y) return 1;
				return 0;
			});
		}
		this.navigation();
	}

	canSpawn:boolean=true;
	onSpawn(){
		if (!this.canSpawn) return;
		let i:number=Math.floor(Math.random()*this.tilemap.spawns.length);
		let _sprite:WalkingObject;

		if (Math.random()<0.7) _sprite=new WalkingObject(this.tilemap.spawns[i]);
		else _sprite=new FlyingObject(this.tilemap.spawns[i]);
		_sprite.goto((this.tilemap.spawns[i].loc.x+0.5)*this.tilemap.tileSize,(this.tilemap.spawns[i].loc.y+0.5)*this.tilemap.tileSize);
		this.objects.addObject(_sprite);
		//}
	}

	onMouseMove(e:JME_MoveEvent){
		let _drag:GameObject=e.mouse.drag;
		if (_drag!=null && !e.mouse.timerRunning){
			_drag.tweenTo(e.mouse.x,e.mouse.y);
		}
	}

	onKeyDown=(e:JME_KeyEvent)=>{
		if (e.isNumber()){
			this.gameUI.selectButtonAt(Number(e.key)-1);
		}else{
			switch(e.key){
				case " ": this.running=!this.running; break;
				case "ArrowLeft": case "a":
					this.keyStates.left=true;
					break;
				case "ArrowRight": case "d":
					this.keyStates.right=true;
					break;
				case "ArrowUp": case "w":
					this.keyStates.up=true;
					break;
				case "ArrowDown": case "s":
					this.keyStates.down=true;
					break;
				case "b":
					this.running=true;
					this.onTick();
					this.running=false;
					break;
				case "v":
					this.canSpawn=!this.canSpawn;
					break;
			}
		}
	}

	onKeyUp=(e:JME_KeyEvent)=>{
		switch(e.key){
			case "ArrowLeft": case "a":
				this.keyStates.left=false;
				break;
			case "ArrowRight": case "d":
				this.keyStates.right=false;
				break;
			case "ArrowUp": case "w":
				this.keyStates.up=false;
				break;
			case "ArrowDown": case "s":
				this.keyStates.down=false;
				break;
		}
	}

	selectObject(v:GameObject=null){
		if (this.selected!=null) this.selected.clearSelect();
		this.selected=null;
		
		if (v!=null){		
			this.selected=v;
			this.selected.onSelect();
			this.gameUI.showProperties(v);
		}else{
			this.gameUI.hideProperties();
		}
	}

	refreshAllWalkers(){
		this.objects.forEach(function(){
			if (this.type==ObjectType.WALKING){
				this.nextTile=null;
			}
		});
	}

	onClick=(e:JME_ClickEvent)=>{
		let _point:PIXI.Point=new PIXI.Point(e.mouse.x-this.gameStage.x,e.mouse.y-this.gameStage.y);
		if (this.tilemap.bounds.contains(_point.x,_point.y)){
			let _building:BuildingObject;
			
			let _tile=this.tilemap.getTileAt(_point);
			switch(this.interactionMode){
				case InteractionMode.SELECT:
					_building=this.tilemap.getBuildingAt(_tile.index);
					if (_building!=null){
						this.selectObject(_building);
					}else{
						let _walking:GameObject=this.objects.getClosestObject(_point,30,{has:{type:ObjectType.WALKING}});
						this.selectObject(_walking);
					}
					break;
				case InteractionMode.SELL:
					this.selectObject();
					_building=this.tilemap.removeBuildingAt(_tile.index);
					if (_building!=null){
						this.objects.removeObject(_building);
						this.refreshAllWalkers();
					}
					break;
				case InteractionMode.WALL:
					_building=this.tilemap.getBuildingAt(_tile.index);
					if (_building==null){
						this.tryBuildObject(new WallBuilding(_tile),_tile);
					}
					break;
				case InteractionMode.TURRET:
					_building=this.tilemap.getBuildingAt(_tile.index);
					if (_building==null){
						this.tryBuildObject(new BuildingObject(_tile),_tile);
					}
					break;
				case InteractionMode.NOVA:
					_building=this.tilemap.getBuildingAt(_tile.index);
					if (_building==null){
						this.tryBuildObject(new NovaBuilding(_tile),_tile);
					}
					break;
				case InteractionMode.ICE:
					_building=this.tilemap.getBuildingAt(_tile.index);
					if (_building==null){
						this.tryBuildObject(new IceBuilding(_tile),_tile);
					}
					break;
				case InteractionMode.POISON:
					_building=this.tilemap.getBuildingAt(_tile.index);
					if (_building==null){
						this.tryBuildObject(new PoisonBuilding(_tile),_tile);
					}
					break;
			}
		}else{
			if (e.mouse.drag!=null){
				//e.mouse.drag.colorFlash(0x00ff00);
				//JMBL.tweenWait(e.mouse.drag,30,function(){JMBL.tweenTo(this,20,{alpha:0},function(){e.mouse.drag.dispose();});});
			}else{
				/*let _object:GameObject=new SquareObject;
				facade.game.objects.addObject(_object);
				_object.goto(e.mouse.x,e.mouse.y);*/
			}
		}
	}

	tryBuildObject(_building:BuildingObject,_tile:JMTile){
		if (this.tilemap.addBuildingAt(_building,_tile.index)){
			this.objects.addObject(_building);
			this.objects.forEach(function(){
				if (this.type==ObjectType.WALKING){
					this.nextTile=null;
				}
			});
			this.selectObject(_building);
		}else{
			this.selectObject();
		}
	}

	onDrag(e:JME_DragEvent){
		facade.game.onMouseMove(e);
	}

	startDrag(){
	}
	endDrag(){
	}
	clearSelection(){
	}

	//====NAVIGATION====\\
	scroller:any={
		mouse:null,
		x:0,
		y:0,
		vX:0,
		vY:0
	}

	navigation=()=>{
		if (this.scroller.mouse!=null){
			if (!this.scroller.mouse.down){
				this.scroller.mouse=null;
			}else{
				this.scroller.vX=(this.scroller.mouse.x-this.scroller.x-this.gameStage.x)/15;
				this.scroller.vY=(this.scroller.mouse.y-this.scroller.y-this.gameStage.y)/15;
			}
		}else{
			if (this.keyStates.left) this.scroller.vX+=1;
			if (this.keyStates.right) this.scroller.vX-=1;
			if (this.keyStates.up) this.scroller.vY+=1;
			if (this.keyStates.down) this.scroller.vY-=1;
		}

		if (this.scroller.vX!=0 || this.scroller.vY!=0){
			this.gameStage.x+=this.scroller.vX;
			this.gameStage.y+=this.scroller.vY;
			this.scroller.vX*=0.95;
			this.scroller.vY*=0.95;
			if (Math.abs(this.scroller.vY)<0.001 && Math.abs(this.scroller.vX)<0.001){
				this.scroller.vX=0;
				this.scroller.vY=0;
			}
		}

		
		if (this.gameStage.x<this.playRect.right-this.tilemap.bounds.width) this.gameStage.x=this.playRect.right-this.tilemap.bounds.width;
		if (this.gameStage.x>this.playRect.x) this.gameStage.x=this.playRect.x;

		if (this.gameStage.y<this.playRect.bottom-this.tilemap.bounds.height) this.gameStage.y=this.playRect.bottom-this.tilemap.bounds.height;
		if (this.gameStage.y>this.playRect.y) this.gameStage.y=this.playRect.y;
	}
}