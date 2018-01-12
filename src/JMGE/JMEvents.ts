enum EventType{
	UI_SELECT_MODE,
	DRAG_EVENT,
	MOVE_EVENT,
	MOUSE_DOWN,
	MOUSE_UP,
	KEY_DOWN,
	KEY_UP,
	CLICK_EVENT,
	UI_CLICK_SKILL,
	UI_BUTTON_PRESS,
}

enum ObjectEvent{
	END_TWEEN,
}

class JME{
	private static registers:Array<JMERegister>=[];
	private static activeRegisters:Array<JMERegister>=[];
	private static eventLog:Array<any>=[];
	private static tickEvents:Array<Function>=[];

	static init(_ticker:any){
		_ticker.add(this.onTick.bind(this));
	}

	static addToTicker(_output:Function){
		this.tickEvents.push(_output);
	}

	static removeFromTicker(_output:Function){
		for (var i=0;i<this.tickEvents.length;i+=1){
			if (this.tickEvents[i]==_output){
				this.tickEvents.splice(i,1);
				return;
			}
		}
	}

	private static createRegister(_type:EventType,_log:boolean=false){
		this.registers[_type]=new JMERegister(_type);
		if (_log) this.addEventListener(_type,JME.logEvent);
	}

	static addEventListener(_type:EventType,_function:Function,_once:Boolean=false){
		if (this.registers[_type]==null) this.createRegister(_type);
		if (_once){
			this.registers[_type].once.push(_function);
		}else{
			this.registers[_type].listeners.push(_function);
		}
	}

	static removeEventListener(_type:EventType,_function:Function){
		JMBL.removeFromArray(_function,this.registers[_type].listeners);
	}

	static publishEvent(_type:EventType,_par:any){
		if (this.registers[_type]==null) this.createRegister(_type);
		this.registers[_type].events.push(_par);
		if (!this.registers[_type].active){
			this.registers[_type].active=true;
			this.activeRegisters.push(this.registers[_type]);
		}
	}

	static publishSelfEvent(_register:JMERegister,_par:any){
		_register.events.push(_par);
		if (!_register.active){
			_register.active=true;
			this.activeRegisters.push(_register);
		}
	}

	private static logEvent(e:any){
		this.eventLog.push(e);	
	}
	static traceEventLog(){
		console.log(this.eventLog);
	}

	private static onTick(){
		while (this.activeRegisters.length>0){
			let _register:JMERegister=this.activeRegisters[0];
			while (_register.events.length>0){
				let _cEvent:JMEvent=_register.events[0];
				for (var i:number=0;i<_register.listeners.length;i+=1){
					_register.listeners[i](_cEvent);
				}
				while (_register.once.length>0){
					_register.once[0](_cEvent);
					_register.once.shift();
				}
				_register.events.shift();
			}
			_register.active=false;
			this.activeRegisters.shift();
		}
		for (var i=0;i<this.tickEvents.length;i+=1){
			this.tickEvents[i]();
		}
	}
}

class JMERegister{
	listeners:Array<Function>=[];
	once:Array<Function>=[];

	events:Array<JMEvent>=[];
	active:Boolean=false;
	type:any;
	

	constructor(_type:any){
		this.type=_type;
	}
}

class JMEvent{
	eventType:any;
}

class JME_UISelectModeEvent extends JMEvent{
	mode:number;
	constructor(_mode:number){
		super();
		this.eventType=EventType.UI_SELECT_MODE;
		this.mode=_mode;
	}
}

/*function EventManager_UIClickSkill(i,_callback){
	this.eventType=EventManagerTypes.UI_CLICK_SKILL;
	this.index=i;
	this.callback=_callback || function(){};
}

function EventManager_UIButtonPress(_id,_callback){
	this.eventType=EventManagerTypes.UI_BUTTON_PRESS;
	this.id=_id;
	this.callback=_callback || function(){};
}*/

class JME_MoveEvent extends JMEvent{
	mouse:MouseObject;

	constructor(_mouse:MouseObject){
		super();
		this.eventType=EventType.MOVE_EVENT;
		this.mouse=_mouse;
	}
}

class JME_ClickEvent extends JMEvent{
	mouse:MouseObject;

	constructor(_mouse:MouseObject){
		super();
		this.eventType=EventType.CLICK_EVENT;
		this.mouse=_mouse;
	}
}

class JME_DragEvent extends JMEvent{
	mouse:MouseObject;
	startDrag:Boolean;
	constructor(_mouse:MouseObject,_startDrag:Boolean){
		super();
		this.eventType=EventType.DRAG_EVENT;
		this.mouse=_mouse;
		this.startDrag=_startDrag;
	}
}

class JME_TweenEnd extends JMEvent{
	target:GameObject;
	constructor(_target:GameObject){
		super();
		this.eventType=ObjectEvent.END_TWEEN;
		this.target=_target;
	}
}

class JME_KeyEvent extends JMEvent{
	key:string;
	constructor(_key:string){
		super();
		this.key=_key;
	}

	isNumber():boolean{
		switch(this.key){
			case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": case "0":
				return true;
		}
		return false;
	}
}