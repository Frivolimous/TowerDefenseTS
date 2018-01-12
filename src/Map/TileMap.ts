class JMTileMap extends PIXI.Container{
	diagonal:number=Math.sqrt(2);
	tiles:Array<JMTile>=[];
	tileSize:number;
	tilesAcross:number;
	goal:number;
	starts:Array<number>;
	spawns:Array<JMTile>=[];
	bounds:JMBL_Rect;

	constructor(options:JMTileOptions){
		super();
		this.tileSize=options.tileSize||20;
		this.tilesAcross=options.tilesAcross;
		for (var i=0;i<options.tilesAcross*options.tilesDown;i+=1){
			let _tile:JMTile=new JMTile(i,new PIXI.Point(i%options.tilesAcross,Math.floor(i/options.tilesAcross)),options.tileSize);
			this.tiles.push(_tile);
			if (i%options.tilesAcross!=0){
				_tile.addOutlet(this.tiles[i-1]);
			}
			if (i>=options.tilesAcross){
				_tile.addOutlet(this.tiles[i-options.tilesAcross]);
			}
			_tile.view.x=_tile.loc.x*this.tileSize;
			_tile.view.y=_tile.loc.y*this.tileSize;
			this.addChild(_tile.view);
		}
		this.interactive=true;
		this.bounds=new JMBL_Rect(0,0,this.tileSize*this.tilesAcross,this.tileSize*options.tilesDown);
	}

	loadWalkMap(map:string){
		this.goal=-1;
		for (var i:number=0;i<map.length;i+=1){
			switch(map.charAt(i)){
				case "0":
					this.tiles[i].walkable=false;
					this.tiles[i].buildable=false;
					break;
				case "x":
					this.tiles[i].speed=0.75;
					break;
				case "y":
					this.tiles[i].speed=0.5;
					break;
				case "s":
					this.spawns.push(this.tiles[i]);
					this.tiles[i].buildable=false;
					this.tiles[i].isSpawn=true;
					break;
				case "e":
					this.goal=i;
					this.tiles[i].buildable=false;
					break;
				case "u":
					this.tiles[i].buildable=false;
					break;
				case "p":
					this.tiles[i].walkable=false;
					break;
			}
		}
		if (this.goal>=0){
			this.makeRouteMap(this.goal);
			this.makeAirMap(this.goal);
		}
	}

	addBlockAt(i:number):boolean{
		if (this.tiles[i].rating==-1) return false;
		this.tiles[i].walkable=false;
		
		this.makeRouteMap();
		for (var j=0;j<this.spawns.length;j+=1){
			if (this.spawns[j].rating==-1){
				this.tiles[i].walkable=true;
				this.makeRouteMap();
				return false;
			}
		}
		return true;
	}
	removeBlockAt(i:number):boolean{
		if (this.tiles[i].rating!=-1) return false;
		this.tiles[i].walkable=true;

		this.makeRouteMap();
		return true;
	}

	addBuildingAt(building:BuildingObject,i:number):boolean{
		if (this.tiles[i].building!=null || !this.tiles[i].buildable) return false;
		this.tiles[i].building=building;

		this.makeRouteMap();
		for (var j=0;j<this.spawns.length;j+=1){
			if (this.spawns[j].rating==-1){
				this.tiles[i].building=null;
				this.makeRouteMap();
				return false;
			}
		}
		building.goto((this.tiles[i].loc.x+0.5)*this.tileSize,(this.tiles[i].loc.y+0.5)*this.tileSize);
		return true;
	}

	getBuildingAt(i:number):BuildingObject{
		return this.tiles[i].building;
	}

	removeBuildingAt(i:number):BuildingObject{
		if (this.tiles[i].building==null) return null;
		let m:BuildingObject=this.tiles[i].building;
		this.tiles[i].building=null;
		if (m.parent!=null) m.parent.removeChild(m);
		this.makeRouteMap();
		return m;
	}

	makeAirMap(_goalIndex:number=-1){
		if (_goalIndex>=0) this.goal=_goalIndex;

		let _goal:JMTile=this.tiles[this.goal];
		_goal.airRating=0;
		let open:Array<JMTile>=[_goal];
		let closed:Array<JMTile>=[];
		while(open.length>0){
			let _current:JMTile=open.shift();
			closed.push(_current);

			for (let i:number=0;i<_current.outlets.length;i+=1){
				let _current2:JMTile=_current.outlets[i];
				if (open.indexOf(_current2)==-1 && closed.indexOf(_current2)==-1 && (_current2.getWalkable() || _current2.buildable)){
					if (_current.loc.x!=_current2.loc.x && _current.loc.y!=_current2.loc.y){
						_current2.airRating=_current.airRating+this.diagonal;
					}else{
						_current2.airRating=_current.airRating+1;
					}
					open.push(_current2);
				}
			}
			open.sort((a,b):number=>{
				if (a.airRating<b.airRating) return -1;
				if (b.airRating<a.airRating) return 1;
				return 0;
			});
		}
		let hasBlocked:boolean=false;
		main:for (let i:number=0;i<this.tiles.length;i+=1){
			
			for (let j:number=0;j<closed.length;j+=1){
				if (this.tiles[i]==closed[j]){
					continue main;
				}
			}
			this.tiles[i].airRating=-1;
			hasBlocked=true;
		}
	}
	
	makeRouteMap(_goalIndex:number=-1){
		if (_goalIndex>=0) this.goal=_goalIndex;

		let _goal:JMTile=this.tiles[this.goal];
		_goal.rating=0;
		_goal.best=null;
		let open:Array<JMTile>=[_goal];
		let closed:Array<JMTile>=[];
		while(open.length>0){
			let _current:JMTile=open.shift();
			closed.push(_current);

			for (let i:number=0;i<_current.outlets.length;i+=1){
				let _current2:JMTile=_current.outlets[i];
				if (open.indexOf(_current2)==-1 && closed.indexOf(_current2)==-1 && _current2.getWalkable()){
					if (_current.loc.x!=_current2.loc.x && _current.loc.y!=_current2.loc.y){
						_current2.rating=_current.rating+this.diagonal/(_current.getSpeed()+_current2.getSpeed())*2;
					}else{
						_current2.rating=_current.rating+2/(_current.getSpeed()+_current2.getSpeed());
					}
					_current2.best=_current;
					open.push(_current2);
				}
			}
			open.sort((a,b):number=>{
				if (a.rating<b.rating) return -1;
				if (b.rating<a.rating) return 1;
				return 0;
			});
		}
		let hasBlocked:boolean=false;
		main:for (let i:number=0;i<this.tiles.length;i+=1){
			
			for (let j:number=0;j<closed.length;j+=1){
				if (this.tiles[i]==closed[j]){
					this.tiles[i].temporaryRecolor();
					continue main;
				}
			}
			this.tiles[i].rating=-1;
			this.tiles[i].best=null;
			hasBlocked=true;
			this.tiles[i].temporaryRecolor();
		}

	}

	getTileAt(point:PIXI.Point):JMTile{
		let x:number=Math.max(0,Math.min(Math.floor(point.x/this.tileSize),this.tilesAcross-1));
		let y:number=Math.max(0,Math.min(Math.floor(point.y/this.tileSize),this.tiles.length/this.tilesAcross-1));
		let i:number=x+y*this.tilesAcross;
		return this.tiles[i];
	}
}

class JMTile{
	loc:PIXI.Point;
	index:number;
	speed:number=1;
	walkable:boolean=true;
	outlets:Array<JMTile>=[];
	best:JMTile=null;
	rating:number=-1;
	airRating:number=-1;
	view:PIXI.Sprite;
	width:number;
	buildable:boolean=true;
	building:BuildingObject=null;
	isSpawn:boolean=false;

	constructor(i:number,loc:PIXI.Point,width:number){
		this.index=i;
		this.loc=loc;
		this.width=width;
		this.view=new PIXI.Sprite(TextureData.square);
		this.view.tint=0x00ff00;
		//this.view.width=this.view.height=width;
		(this.view as any).text=new PIXI.Text(String(i),{fontSize:12});
		this.view.addChild((this.view as any).text);
	}

	getSpeed():number{
		let m:number=this.speed;
		if (this.building!=null) m=Math.min(this.speed,this.building.speed);
		return m;
	}

	getWalkable():boolean{
		if (this.building!=null && this.building.speed==0) return false;
		else return this.walkable;
	}

	temporaryRecolor(type:number=1){
		let _tint:number=0;
		switch(type){
			case 0: // rating based
				(this.view as any).text.text=Math.floor(this.rating*10)/10;
				if (this.rating<0) _tint=0x770000;
				else if (this.rating<2) _tint=0x00ffff;
				else if (this.rating<10) _tint=0x00ff00;
				else if (this.rating<20) _tint=0xffff00;
				else if (this.rating<30) _tint=0xffcc00;
				else _tint=0xcc0000;
				break;
			case 1: // representation
				//(this.view as any).text.text=Math.floor(this.rating*10)/10;
				(this.view as any).text.text="";
				//if (this.rating<0) _tint=0x770000;
				if (this.rating==0) {_tint=0x00ffff; (this.view as any).text.text="Goal";}
				else if (this.isSpawn) {_tint=0xaa0000; (this.view as any).text.text="Spwn";}
				else if (!this.walkable){
					if (!this.buildable){
						_tint=0x000000;
					}else{
						_tint=0x777777;
					}
				}else if (!this.buildable){
					_tint=0x770000;
				}
				else if (this.speed<0.7) _tint=0xaaaa00;
				else if (this.speed<1) _tint=0xffcc00;
				else _tint=0x00ff00;
				break;
		}
		
		this.view.tint=_tint;
		(this.view as any).text.x=(this.width-(this.view as any).text.width)/2;
		(this.view as any).text.y=(this.width-(this.view as any).text.height)/2;
	}

	addOutlet(_tile:JMTile,_addTo:boolean=true){
		for (let i:number=0;i<this.outlets.length;i+=1){
			if (this.outlets[i]==_tile){
				return;
			}
		}
		this.outlets.push(_tile);
		if (_addTo) _tile.addOutlet(this,false);
	}

	removeOutlet(_tile:JMTile){
		for (let i:number=0;i<this.outlets.length;i+=1){
			if (this.outlets[i]==_tile){
				this.outlets.splice(i,1);
				return;
			}
		}
	}

	pointInTile(_point:any){
		if (_point.x>this.loc.x*this.width && _point.x<(this.loc.x+1)*this.width && _point.y>this.loc.y*this.width && _point.y<(this.loc.y+1)*this.width){
			return true;
		}else{
			return false;
		}
	}
}

interface JMTileOptions{
	tileSize?:number,
	tilesAcross:number,
	tilesDown:number,
}