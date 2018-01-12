class CONFIG{
	static INIT={
		STAGE_WIDTH:800,
		STAGE_HEIGHT:500,
		RESOLUTION:2,
		BACKGROUND_COLOR:0,
		MOUSE_HOLD:200,
	}
}

class Facade{
	app:any;
	interactionMode:String="desktop";
	stageBorders:JMBL_Rect;
	private _Resolution=CONFIG.INIT.RESOLUTION;
	static exists:Boolean=false;

	game:GameManager;
	inputM:InputManager;

	windowToLocal=(e:any):PIXI.Point=>{
		return new PIXI.Point((e.x+this.stageBorders.x)*this._Resolution,(e.y+this.stageBorders.y)*this._Resolution);
	}

	disableGameInput(b:Boolean=true){
		if (b){
			this.inputM.mouseEnabled=false;
		}else{
			this.inputM.mouseEnabled=true;
		}
	}

	constructor(){
		if (Facade.exists) throw "Cannot instatiate more than one Facade Singleton.";
		Facade.exists=true;
		try{
			document.createEvent("TouchEvent");
			this.interactionMode="mobile";
		}catch(e){

		}
		this.stageBorders=new JMBL_Rect(0,0,CONFIG.INIT.STAGE_WIDTH/this._Resolution,CONFIG.INIT.STAGE_HEIGHT/this._Resolution);
		this.app = new PIXI.Application(this.stageBorders.width,this.stageBorders.height,{
			backgroundColor:0xff0000,
			antialias:true,
			resolution:this._Resolution,
			roundPixels:true,
		});
		(document.getElementById("game-canvas") as any).append(this.app.view);

		this.stageBorders.width*=this._Resolution;
		this.stageBorders.height*=this._Resolution;

		this.app.stage.scale.x=1/this._Resolution;
		this.app.stage.scale.y=1/this._Resolution;
		this.stageBorders.x=this.app.view.offsetLeft;
		this.stageBorders.y=this.app.view.offsetTop;
		this.app.stage.interactive=true;

		let _background=new PIXI.Graphics();
		_background.beginFill(CONFIG.INIT.BACKGROUND_COLOR);
		_background.drawRect(0,0,this.stageBorders.width,this.stageBorders.height);
		this.app.stage.addChild(_background);
		/*window.addEventListener("resize",function(){
			stageBorders.left=app.view.offsetLeft;
			stageBorders.top=app.view.offsetTop;
		});*/
		/*
		game.init();
		ui.init();
		input.init(gameM.gameStage);
		game.start();*/
		let self:any=this;
		TextureData.init(this.app.renderer);
		window.setTimeout(function(){self.init()},10);
	}

	init(){
		//this will happen after "preloader"
		JME.init(this.app.ticker);
		this.game=new GameManager(this.app);
		this.inputM=new InputManager(this.app,this.game.objects);
	}

	toPS(n:number):number{
		return Math.floor(600/n)/10;
	}

	toDur(n:number):number{
		return Math.floor(n/6)/10;
	}

	pixelToTile(n:number,minusHalf:boolean=true):number{
		return Math.floor(n/3-(minusHalf?5:0))/10;
	}

	toTPS(n:number):number{
		console.log(n);
		return Math.floor(n*60*30*10)/10;
	}
}

var facade:Facade;
function initialize_game(){
	facade=new Facade();
}