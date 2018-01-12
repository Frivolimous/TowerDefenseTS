enum DisplayState{
	NORMAL,
	DARKENED,
	BLACKENED,
	GREYED,
	BRIGHTENED,
}

enum BoolPlus{
	False,
	Enabled,
	Active
}

class JMBUI_BasicElement extends PIXI.Sprite{
	graphics:PIXI.Graphics=new PIXI.Graphics;
	label:PIXI.Text;

	constructor(options:JMBUI_GraphicOptions){
		super();
		options=options || {};

		this.addChild(this.graphics);
		if (options.width!=null){
			this.graphics.beginFill(options.bgColor || 0x808080);
			if (options.rounding!=null){
				this.graphics.drawRoundedRect(0,0,options.width,options.height,options.rounding);
			}else{
				this.graphics.drawRect(0,0,options.width,options.height);
			}
			this.graphics.alpha=options.alpha==null?1:options.alpha;
		}
		this.x=options.x || 0;
		this.y=options.y || 0;

		if (options.label!=null){
			this.label=new PIXI.Text(options.label,options.labelStyle || {});
			if (this.label.width>this.graphics.width*0.9){
				this.label.width=this.graphics.width*0.9;
				this.label.scale.y=this.label.scale.x;
			}
			this.label.x=(options.width-this.label.width)/2;
			this.label.y=(options.height-this.label.height)/2;
			this.addChild(this.label);
		}
	}
}

class JMBUI_InteractiveElement extends JMBUI_BasicElement{
	downFunction:Function;
	overlay:PIXI.Graphics;
	displayState:DisplayState;

	constructor(options:JMBUI_GraphicOptions){
		super(options);
		options=options || {};
		this.interactive=true;
		if (options.downFunction!=null){
			this.downFunction=options.downFunction;
			this.on("pointerdown",this.downFunction);
		}
		options.displayState=options.displayState || DisplayState.NORMAL;
		this.setDisplayState(options.displayState);
	}

	setDisplayState=(_state:DisplayState)=>{
		if (this.displayState==_state) return;
		this.displayState=_state;

		if (this.overlay==null) this.overlay=new PIXI.Graphics();
		this.overlay.clear();
		switch(_state){
			case DisplayState.DARKENED:
				this.overlay.beginFill(0);
				this.overlay.alpha=0.5;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.BLACKENED:
				this.overlay.beginFill(0);
				this.overlay.alpha=0.8;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.GREYED:
				this.overlay.beginFill(0x999999);
				this.overlay.alpha=0.5;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.BRIGHTENED:
				this.overlay.beginFill(0xffffff);
				this.overlay.alpha=0.3;
				this.overlay.drawRect(0,0,this.graphics.width,this.graphics.height);
				this.addChild(this.overlay);
				break;
			case DisplayState.NORMAL: 
			default:
				if (this.overlay!=null && this.overlay.parent==this){
					this.removeChild(this.overlay);
				}break;
		}
	}
}

class JMBUI_Button extends JMBUI_InteractiveElement{
	output:Function;
	downOnThis:Boolean=false;
	disabled:Boolean=false;
	timeout:BoolPlus=BoolPlus.Enabled;

	constructor(options:JMBUI_GraphicOptions){
		super(JMBL.applyDefaultOptions(options,{
			x:50, y:50, width:200, height:50, bgColor:0x8080ff,
		}));
		this.output=options.output;
		this.buttonMode=true;
		if (facade.interactionMode=="desktop"){
			this.addListener("pointerover",(e:any)=>{
				if (!this.disabled) this.setDisplayState(DisplayState.DARKENED);
				facade.disableGameInput();
			});

			this.addListener("pointerout",(e:any)=>{
				if (!this.disabled) this.setDisplayState(DisplayState.NORMAL);
				this.downOnThis=false;
				facade.disableGameInput(false);
			});
			this.addListener("pointerdown",(e:any)=>{
				if (!this.disabled) this.setDisplayState(DisplayState.BRIGHTENED);
				this.downOnThis=true;
				if (this.timeout==BoolPlus.Enabled){
					this.timeout=BoolPlus.Active;
					
					window.setTimeout(()=>{this.timeout=BoolPlus.Enabled;},CONFIG.INIT.MOUSE_HOLD);
				}
			});
			this.addListener("pointerup",(e:any)=>{
				if (!this.disabled) this.setDisplayState(DisplayState.DARKENED);
				if (this.downOnThis && !this.disabled && this.output!=null && this.timeout!=BoolPlus.Enabled) this.output();
				this.downOnThis=false;
			});
		}else{
			this.addListener("pointerup",(e:any)=>{
				if (!this.disabled && this.output!=null) this.output();
			});
		}
	}
	disable(b:boolean=true){
		this.disabled=b;
		if (b){
			this.setDisplayState(DisplayState.BLACKENED);
		}else{
			this.setDisplayState(DisplayState.NORMAL);
		}
	}
}

class JMBUI_ClearButton extends JMBUI_InteractiveElement{
	constructor (options:JMBUI_GraphicOptions){
		super(JMBL.applyDefaultOptions(options,{
			bgColor:0x00ff00,
			alpha:0.01,
			width:190,
			height:50,
			x:0,
			y:0,
		}));

		this.buttonMode=true;
	}
}

class JMBUI_SelectButton extends JMBUI_Button{
	index:number;
	myList:Array<JMBUI_SelectButton>;
	selectRect:PIXI.Graphics;
	selectFunction:Function;
	selected:boolean;

	constructor(index:number,selectList:Array<JMBUI_SelectButton>,selectFunction:Function,options:JMBUI_GraphicOptions=null){
		super(options);
		this.index=index;
		this.myList=selectList;
		this.output=this.selectThis;
		this.selectFunction=selectFunction;
	}

	selectThis(){
		if (this.selected) return;

		for (var i=0;i<this.myList.length;i+=1){
			this.myList[i].setSelectState(this.myList[i]==this);
		}
		this.selectFunction(this.index);
	}

	setSelectState(b:boolean){
		if (b){
			if (this.selectRect==null){
				this.selectRect=new PIXI.Graphics;
				this.selectRect.lineStyle(3,0xffff00);
				this.selectRect.drawRect(this.graphics.x,this.graphics.y,this.graphics.width,this.graphics.height);
			}
			this.addChild(this.selectRect);
		}else{
			if (this.selectRect!=null && this.selectRect.parent!=null) this.selectRect.parent.removeChild(this.selectRect);
		}
		this.selected=b;
	}
}

class JMBUI_MaskedWindow extends JMBUI_BasicElement{
	mask:PIXI.Graphics=new PIXI.Graphics;
	objects:Array<any>=[];
	autoSort:boolean;
	offsetY:number=0;
	goalY:number=1;
	scrollbar:JMBUI_Scrollbar=null;
	container:PIXI.Sprite=new PIXI.Sprite();
	vY:number=0;
	sortMargin:number=5;
	dragging:boolean=false;
	scrollHeight:number=0;

	constructor(options:JMBUI_MaskedWindowOptions=null){
		super(options);
		options=options||{};
		this.addChild(this.container);
		this.addChild(this.mask);
		this.mask.beginFill(0);
		this.mask.drawRect(0,0,options.width||50,options.height||100);
		this.autoSort=options.autoSort||false;
		this.interactive=true;
		this.sortMargin=options.sortMargin||5;
		this.addListener("pointerover",(e:any)=>{
			facade.disableGameInput();
		});
		this.addListener("pointerout",(e:any)=>{
			facade.disableGameInput(false);
		});
		this.addListener("pointerdown",(e:any) => {
		   let _point:PIXI.Point=facade.windowToLocal(e.data.originalEvent);
			this.offsetY=_point.y-this.y-this.container.y;
			this.dragging=true;
		});

		window.addEventListener("pointerup",(e:any) => {
			this.goalY=1;
			this.dragging=false;
		});

		JME.addEventListener(EventType.MOVE_EVENT,(e:any) => {
			if (this.dragging){
				let _y:number=e.mouse.y-this.y-this.offsetY;
				this.goalY=e.mouse.y-this.y-this.offsetY;
				this.vY=(_y-this.container.y)/4;
			}
		});
		JME.addToTicker(this.update);
		window.addEventListener("wheel",this.onWheel);
	}
	addScrollbar=(_scrollbar:JMBUI_Scrollbar)=>{
		this.scrollbar=_scrollbar;
		_scrollbar.output=this.setScroll;
	}

	onWheel=(e:any)=>{
		let _point:PIXI.Point=facade.windowToLocal(e);
		if (_point.x>this.x && _point.x<this.x+this.mask.width && _point.y>this.y && _point.y<this.y+this.mask.height){
			this.vY-=e.deltaY*0.008;
		}
	}

	setScroll=(p:number)=>{
		if (this.scrollHeight>this.mask.height){
			this.container.y=p*(this.mask.height-this.scrollHeight);
			if (this.container.y>0) this.container.y=0;
			if (this.container.y<this.mask.height-this.scrollHeight) this.container.y=this.mask.height-this.scrollHeight
		}else{
			this.container.y=0;
		}
	}
	getRatio=():number=>{
		return Math.min(1,this.mask.height/this.scrollHeight);
	}

	update=()=> {
		if (this.goalY<=0){
		//	console.log(this.goalY);
			this.vY=(this.goalY-this.container.y)/4;
		}
		if (this.vY!=0){
		//	console.log(this.vY);
			if (Math.abs(this.vY)<0.1) this.vY=0;
			else{
				let _y:number=this.container.y+this.vY;
				_y=Math.min(0,Math.max(_y,this.mask.height-this.scrollHeight));
				this.vY*=0.95;	
				if (this.scrollbar!=null) this.scrollbar.setPosition(_y/(this.mask.height-this.scrollHeight));
				else this.setScroll(_y/(this.mask.height-this.scrollHeight));
			}	
		}
	}

	addObject=(_object:any)=>{
		this.objects.push(_object);
		_object.x-=this.x-this.container.x;
		_object.y-=this.y-this.container.y;
		this.container.addChild(_object);
		if (this.autoSort) this.sortObjects();
	}

	removeObject=(_object:any)=>{
		for (var i=0;i<this.objects.length;i+=1){
			if (this.objects[i]==_object){
				this.removeObjectAt(i);
				return;
			}
		}
	}

	removeObjectAt=(i:number)=>{
		this.container.removeChild(this.objects[i]);
		this.objects.splice(i,1);
		if (this.autoSort) this.sortObjects();
	}

	sortObjects=()=>{
		this.scrollHeight=this.sortMargin;
		for (var i:number=0;i<this.objects.length;i+=1){
			this.objects[i].y=this.scrollHeight;
			//this.objects[i].x=this.objects[i].graphics.width/2;
			this.objects[i].timeout=BoolPlus.Enabled;
			this.objects[i].x=0;
			this.scrollHeight+=this.objects[i].graphics.height+this.sortMargin;
 		}
	}
}

class JMBUI_Gauge extends JMBUI_BasicElement{
	value:number;
	max:number;
	percent:number;
	front:PIXI.Graphics;

	constructor(color:number=0x00ff00,options:JMBUI_GraphicOptions=null){
		super(JMBL.applyDefaultOptions(options,{
			width:100,height:20,bgColor:0x101010}));
		this.front=new PIXI.Graphics();
		this.front.beginFill(color);
		this.front.drawRect(this.graphics.x,this.graphics.y,this.graphics.width,this.graphics.height);
		this.addChild(this.front);
	}

	setValue(value:number,max:number=-1){
		if (max>=1) this.max=max;
		this.value=value;
		this.percent=this.value/this.max;
		this.front.width=Math.floor(Math.max(1,Math.min(this.percent*this.graphics.width,this.graphics.width)));
	}

	setMax(max:number){
		if (max>=1) this.max=max;
		this.percent=this.value/this.max;
		this.front.width=Math.floor(Math.max(1,Math.min(this.percent*this.graphics.width,this.graphics.width)));
	}
}

class JMBUI_Scrollbar extends JMBUI_BasicElement{
	mover:PIXI.Graphics=new PIXI.Graphics();
	output:Function;
	topY:number=0;
	bottomY:number=40;
	dragging:boolean;
	moverColor:number;
	offsetY:number=0;
	ratio:number;

	constructor(options:JMBUI_ScrollbarOptions){
		super(JMBL.applyDefaultOptions(options,{
			x:100, y:50, width:10, height:100, rounding:5,bgColor:0x404080,
		}));
		this.addChild(this.mover);
		this.output=options.output;
		this.interactive=true;
		this.buttonMode=true;
		this.moverColor=options.moverColor || 0x333333;
		this.ratio=options.ratio || 0.5;
		this.drawMover(this.ratio);
		this.setPosition(options.position || 0);

		this.addListener("pointerover",(e:any)=>{
			facade.disableGameInput();
		});
		this.addListener("pointerout",(e:any)=>{
			facade.disableGameInput(false);
		});
		
		this.addListener("pointerdown",(e:any) => {
		   let _point:PIXI.Point=facade.windowToLocal(e.data.originalEvent);
			this.offsetY=_point.y-this.y-this.mover.y;
			this.dragging=true;
		});

		window.addEventListener("pointerup",(e:any) => {
			this.dragging=false;
		});

		JME.addEventListener(EventType.MOVE_EVENT,(e:any) => {
			if (this.dragging){
				//this.mover.y=e.mouse.y-this.y-this.offsetY;

				let _y=e.mouse.y-this.y-this.offsetY;
				_y=Math.max(_y,this.topY);
				_y=Math.min(_y,this.bottomY);
				this.mover.y=_y;
				if (this.output!=null) this.output(this.getPosition());
			}
		});
	}

	drawMover=(p:number)=>{
		//p = 0-1
		p=Math.min(1,Math.max(0,p));
		if (p>=1) this.visible=false;
		else this.visible=true;

		this.mover.clear();
		this.mover.beginFill(this.moverColor);
		this.mover.drawRoundedRect(0,0,this.graphics.width,p*this.graphics.height,this.graphics.width/2);
		this.bottomY=this.graphics.height-this.mover.height;
	}

	setPosition=(p:number)=>{
		let _y=p*(this.bottomY-this.topY)+this.topY;
		this.mover.y=_y;
 		if (this.output!=null) this.output(p);
	}

	getPosition=()=>{
		//returns 0-1
		return (this.mover.y-this.topY)/(this.bottomY-this.topY);
	}


	startMove=(e:any)=>{
		this.offsetY=e.y-this.y-this.mover.y;
		this.dragging=true;
	}
}

interface JMBUI_GraphicOptions{
	width?:number,
	height?:number,
	x?:number,
	y?:number,
	bgColor?:number,
	rounding?:number,
	alpha?:number,
	label?:string,
	labelStyle?:PIXI.TextStyleOptions,

	output?:Function,
	downFunction?:Function,
	displayState?:DisplayState,
}

interface JMBUI_MaskedWindowOptions extends JMBUI_GraphicOptions{
	maskHeight?:number,
	maskWidth?:number,
	autoSort?:boolean,
	sortMargin?:number,
}

interface JMBUI_ScrollbarOptions extends JMBUI_GraphicOptions{
	output?:Function,
	moverColor?:number,
	ratio?:number,
	position?:number,
}