class GameUI extends PIXI.Sprite{
	bottomBar:JMBUI_BasicElement;
	topBar:JMBUI_BasicElement;
	rightPanel:JMBUI_BasicElement;
	properties:PropertiesPanel;

	selectButtons:Array<JMBUI_SelectButton>=[];
	selectionOutput:Function;


	constructor(){
		super();
		this.bottomBar=new JMBUI_BasicElement({x:0,y:facade.stageBorders.height-60,width:facade.stageBorders.width-150,height:60,bgColor:0xcccccc});
		this.topBar=new JMBUI_BasicElement({x:0,y:0,width:facade.stageBorders.width-150,height:15,bgColor:0xcccccc,alpha:0.5});
		this.rightPanel=new JMBUI_BasicElement({x:facade.stageBorders.width-150,y:0,width:150,height:facade.stageBorders.height,bgColor:0xaaaaaa});
		this.addChild(this.bottomBar);
		this.addChild(this.topBar);
		this.addChild(this.rightPanel);

		//this.addSelections([["Lorem",0],["Ipsum",12],["Dolor",3],["Venti",4],["Something",5]],function(i:number){console.log(i);});
	}

	getPlayArea():JMBL_Rect{
		return new JMBL_Rect(0,this.topBar.graphics.height,this.rightPanel.x,this.bottomBar.y-this.topBar.graphics.height);
	}

	addSelections(indexes:Array<[string,number]>,output:Function){
		this.clearSelections();
		this.selectionOutput=output;

		for (var i=0;i<indexes.length;i+=1){
			let _button=new JMBUI_SelectButton(indexes[i][1],this.selectButtons,this.selectionOutput,
				{x:20+i*60,y:10,width:50,height:40,label:indexes[i][0]});
			this.bottomBar.addChild(_button);
			this.selectButtons.push(_button);
		}
	}

	addSelection(name:string,index:number){
		let _button=new JMBUI_SelectButton(index,this.selectButtons,this.selectionOutput,
			{x:20+this.selectButtons.length*60,y:10,width:50,height:40,label:name});
		this.bottomBar.addChild(_button);
		this.selectButtons.push(_button);
	}

	clearSelections(){
		this.selectionOutput=null;
		while(this.selectButtons.length>0){
			if (this.selectButtons[0].parent!=null) this.selectButtons[0].parent.removeChild(this.selectButtons[0]);
			this.selectButtons.shift().destroy();
		}
	}

	selectButtonAt(i:number){
		if (i>=this.selectButtons.length) return;
		if (this.selectButtons[i]==null) return;

		this.selectButtons[i].selectThis();
	}

	showProperties(v:GameObject){
		this.hideProperties();

		this.properties=new PropertiesPanel(v);
		this.rightPanel.addChild(this.properties);
	}

	hideProperties(){
		if (this.properties!=null){
			this.properties.parent.removeChild(this.properties);
			this.properties=null;
		}
	}
}


class PropertiesPanel extends JMBUI_BasicElement{
	static TitleStyle:PIXI.TextStyleOptions={fontSize:20,fontWeight:"bold"};
	static ListStyle:PIXI.TextStyleOptions={fontSize:12};

	target:GameObject;
	//buttons:Array<JMBUI_Button>=[];
	priorityButtons:Array<JMBUI_SelectButton>=[];

	constructor(v:GameObject){
		super({x:5,y:100,width:140,height:300,bgColor:0x666666,rounding:10});
		this.target=v;

		if (v.type==ObjectType.BUILDING){
			this.showBuildingProperties(v as BuildingObject);
		}else if (v.type==ObjectType.WALKING){
			this.showWalkingProperties(v as WalkingObject);
		}
	}

	showBuildingProperties(_building:BuildingObject){
		let _title:PIXI.Text=new PIXI.Text(BuildingObject.nameFromType(_building.subtype),PropertiesPanel.TitleStyle);
		_title.x=this.graphics.width/2-_title.width/2;
		_title.y=5;
		this.addChild(_title);

		let _propertiesText:string="";
		if (_building.priority!=PriorityType.NONE){
			_propertiesText+="Range: "+facade.pixelToTile(_building.range)+"\n";
			_propertiesText+="APS: "+facade.toPS(_building.maxCooldown)+"\n";
			if (_building.damage>0){
				_propertiesText+="Damage "+_building.damage+"\n";
			}
			if (_building.effects.length>0){
				for (var i:number=0;i<_building.effects.length;i+=1){
					_propertiesText+=_building.effects[i].getDescription()+"\n";
				}
			}

			if (_building.goa==TwoOptions.One) _propertiesText+="GROUND ONLY\n";
			else if (_building.goa==TwoOptions.Two) _propertiesText+="AIR ONLY\n";

			//if (_building
		}
		let _properties:PIXI.Text=new PIXI.Text(_propertiesText,PropertiesPanel.ListStyle);
		_properties.x=5;
		_properties.y=55;
		this.addChild(_properties);

		/*addSelections(indexes:Array<[string,number]>,output:Function){
		this.clearSelections();*/
		if (_building.priority==PriorityType.ANY){
			let _button:JMBUI_SelectButton=new JMBUI_SelectButton(PriorityType.ANY,this.priorityButtons,_building.setPriority,{x:5,y:30,width:25,height:15,label:"Any"});
			this.priorityButtons.push(_button);
			this.addChild(_button);
			_button.selectThis();
		}else if (_building.priority!=PriorityType.NONE){
			let _button:JMBUI_SelectButton=new JMBUI_SelectButton(PriorityType.STRONGEST,this.priorityButtons,_building.setPriority,{x:5,y:30,width:25,height:15,label:"Strong"});
			this.priorityButtons.push(_button);
			this.addChild(_button);
			_button=new JMBUI_SelectButton(PriorityType.WEAKEST,this.priorityButtons,_building.setPriority,{x:31,y:30,width:25,height:15,label:"Weak"});
			this.priorityButtons.push(_button);
			this.addChild(_button);
			_button=new JMBUI_SelectButton(PriorityType.FIRST,this.priorityButtons,_building.setPriority,{x:57,y:30,width:25,height:15,label:"First"});
			this.priorityButtons.push(_button);
			this.addChild(_button);
			_button=new JMBUI_SelectButton(PriorityType.LAST,this.priorityButtons,_building.setPriority,{x:83,y:30,width:25,height:15,label:"Last"});
			this.priorityButtons.push(_button);
			this.addChild(_button);
			_button=new JMBUI_SelectButton(PriorityType.CLOSEST,this.priorityButtons,_building.setPriority,{x:109,y:30,width:25,height:15,label:"Closest"});
			this.priorityButtons.push(_button);
			this.addChild(_button);
			for (var i=0;i<this.priorityButtons.length;i+=1){
				if (this.priorityButtons[i].index==_building.priority){
					this.priorityButtons[i].selectThis();
					break;
				}
			}
		}
	}

	showWalkingProperties(_walking:WalkingObject){
		let _title:PIXI.Text=new PIXI.Text(WalkingObject.nameFromType(_walking.subtype),PropertiesPanel.TitleStyle);
		_title.x=this.graphics.width/2-_title.width/2;
		_title.y=5;
		this.addChild(_title);

		let _propertiesText:string="";
		_propertiesText+="Max Health: "+_walking.maxHealth+"\n";
		_propertiesText+="Move Speed: "+facade.toTPS(_walking.speed)+"\n";

		/*if (_building.priority!=PriorityType.NONE){
			_propertiesText+="Range: "+_building.range+"\n";
			_propertiesText+="APS: "+facade.toPS(_building.maxCooldown)+"\n";
			if (_building.damage>0){
				_propertiesText+="Damage "+_building.damage+"\n";
			}
			if (_building.effects.length>0){
				for (var i:number=0;i<_building.effects.length;i+=1){
					_propertiesText+=_building.effects[i].getDescription()+"\n";
				}
			}

			if (_building.goa==TwoOptions.One) _propertiesText+="GROUND ONLY\n";
			else if (_building.goa==TwoOptions.Two) _propertiesText+="AIR ONLY\n";

			//if (_building
		}*/
		let _properties:PIXI.Text=new PIXI.Text(_propertiesText,PropertiesPanel.ListStyle);
		_properties.x=5;
		_properties.y=55;
		this.addChild(_properties);
	}
}