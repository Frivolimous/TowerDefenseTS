class InputManager{
	mouse:MouseObject;
	mouseEnabled:Boolean=true;
	app:any;
	objects:ObjectManager;

	constructor(app:any,objects:ObjectManager){
		let self:any=this;
		this.mouse=new MouseObject();
		this.app=app;
		this.objects=objects;

		window.addEventListener("keydown",function(e:any){self.onKeyDown(e);});
		window.addEventListener("keyup",function(e:any){self.onKeyUp(e);});
		
		app.stage.on("pointerdown",function(e:any){self.onMouseDown(e);});
		app.stage.on("pointermove",function(e:any){self.onMouseMove(e);});
		//app.stage.on("wheel",onWheel);
		window.addEventListener("wheel",function(e:any){self.onWheel(e);});
		if (facade.interactionMode=="desktop"){
			window.addEventListener("pointerup",function(e:any){self.onMouseUp(e);});
		}else{
			window.addEventListener("touchend",function(e:any){self.onMouseUp(e);});
		}
	}

	onWheel(e:WheelEvent){
		let _object:GameObject=this.objects.getClosestObject(this.mouse,0);
		if (_object!=null && _object.onWheel!=null){
			_object.onWheel(e.deltaY);
		}
	}

	onMouseDown(e:any){
		let _mouse:MouseObject=this.mouse;
		_mouse.set(e.data.global.x/this.app.stage.scale.x,e.data.global.y/this.app.stage.scale.y);
		_mouse.down=true;
		if (!this.mouseEnabled) return;
		if (_mouse.timerRunning) return;

		//JME.publishEvent(EventType.MOUSE_EVENT,new JME_MouseEvent(_mouse));

		_mouse.drag=this.objects.getClosestObject(_mouse,0,{has:{draggable:true}});
		if (_mouse.drag!=null){
			_mouse.timerRunning=true;
			if (_mouse.drag.clickable){
				setTimeout(function(){
					_mouse.timerRunning=false;
					if (_mouse.drag!=null){
						_mouse.drag.dragging=true;
						if (_mouse.drag.draggable) JME.publishEvent(EventType.DRAG_EVENT,new JME_DragEvent(_mouse.clone(),true));
					}
				},CONFIG.INIT.MOUSE_HOLD);
			}else if (_mouse.drag.draggable){
				_mouse.drag.dragging=true;
				JME.publishEvent(EventType.DRAG_EVENT,new JME_DragEvent(_mouse.clone(),true));
			}
		}else{
			_mouse.timerRunning=true;
			setTimeout(function(){
				_mouse.timerRunning=false;
			},CONFIG.INIT.MOUSE_HOLD);
		}
	}

	onMouseUp(e:any){
		let _mouse=this.mouse;
		_mouse.down=false;

		if (_mouse.drag!=null){
			if (!_mouse.timerRunning){
				_mouse.dragTarget=this.objects.getClosestObject(_mouse,0,{notThis:_mouse.drag});
				_mouse.drag.dragging=false;
				if (_mouse.drag.draggable) JME.publishEvent(EventType.DRAG_EVENT,new JME_DragEvent(_mouse.clone(),false));
			}else{
				if (_mouse.drag.clickable) JME.publishEvent(EventType.CLICK_EVENT,new JME_ClickEvent(_mouse.clone()));
			}
		}else{
			if (_mouse.timerRunning){
				JME.publishEvent(EventType.CLICK_EVENT,new JME_ClickEvent(_mouse.clone()));
			}
		}
		_mouse.drag=null;
		_mouse.dragTarget=null;
	}

	onMouseMove(e:any){
		this.mouse.set(e.data.global.x/this.app.stage.scale.x,e.data.global.y/this.app.stage.scale.y);
		JME.publishEvent(EventType.MOVE_EVENT,new JME_MoveEvent(this.mouse)); 
		//external mouseMove(this.mouse);
	}

	onKeyDown(e:any){
		//if (external keyboard override) dothat;
		switch(e.key){
			case "a": case "A": break;
			case "Control": this.mouse.ctrlKey=true; break;
		}

		JME.publishEvent(EventType.KEY_DOWN,new JME_KeyEvent(e.key));
	}

	onKeyUp(e:any){
		switch(e.key){
			case "Control": this.mouse.ctrlKey=false; break;
		}

		JME.publishEvent(EventType.KEY_UP,new JME_KeyEvent(e.key));
	}
}

class MouseObject extends PIXI.Point{
	//x,y;
	down:Boolean=false;
	ctrlKey:Boolean=false;
	drag:GameObject;
	dragTarget:GameObject;
	timerRunning:Boolean=false;


	clone():MouseObject{
		let m:MouseObject=new MouseObject();
		m.down=this.down;
		m.drag=this.drag;
		m.dragTarget=this.dragTarget;
		m.timerRunning=this.timerRunning;
		m.x=this.x;
		m.y=this.y;
		m.ctrlKey=this.ctrlKey;
		return m;
	}
}