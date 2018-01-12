enum TwoOptions{
	One,
	Two,
	Both
}

class JMBL{
	static shallowClone(obj:any):any{
		let m:any={};
		for (var v in obj){
			m[v]=obj[v];
		}
		return m;
	}
	static deepClone(obj:any):any{
		if (Array.isArray(obj)){
			let m:Array<any>=[]; 	
			for (var i:number=0;i<obj.length;i+=1){
				m.push(this.deepClone(obj[i]));
			}
			return m;
		}else if (obj === Object(obj)){
			let m={};
			for (var v in obj){
				(m as any)[v]=this.deepClone(obj[v]);
			}
			return m;
		}
		return obj;
	}

	static applyDefaultOptions(supplied:any,defaultOptions:any):any{
		supplied = supplied || {};
		for (var v in defaultOptions){
			supplied[v]=supplied[v] || defaultOptions[v];
		}

		return supplied;
	}

	static removeFromArray(_element:any,_array:Array<any>){
		for (var i:number=0;i<_array.length;i+=1){
			if (_array[i]===_element){
				_array.splice(i,1);
				return true;
			}
		}

		return false;
	}
	
	static tweenWait(_obj:any,_maxTicks:number,_function:Function=null){
		let ticks:number=0;
		function _tickThis(){
			ticks+=1;
			if (ticks>_maxTicks){
				JME.removeFromTicker(_tickThis);
				if (_function!=null) _function.call(_obj);
			}
		}
		JME.addToTicker(_tickThis);
	}

	static tweenTo(_obj:any,maxTicks:number,par:any,_function:Function=null){
		if (par==null) return;
		let properties:any={};
		let ticks:number=0;

		for (var v in par){
			if (v=="delay"){
				ticks=-par[v];
			}else{
				properties[v]={start:_obj[v],end:par[v]};
			}
		}
		function _tickThis(){
			ticks+=1;
			if (ticks>maxTicks){
				JME.removeFromTicker(_tickThis);
				if (_function!=null) _function.call(_obj);
			}else if (ticks>=0){
				for (var v in properties){
					_obj[v]=properties[v].start+(properties[v].end-properties[v].start)/maxTicks*ticks;
				}
			}
		}
		JME.addToTicker(_tickThis);
	}
	static tweenFrom(_obj:any,maxTicks:number,par:any,_function:Function=null){
		if (par==null) return;
		let newPar:any={};
		for (var v in par){
			if (v=="delay"){
				newPar[v]=par[v];
			}else{
				newPar[v]=_obj[v];
				_obj[v]=par[v];
			}
		}

		JMBL.tweenTo(_obj,maxTicks,newPar,_function);
	}


	static tweenColor(_obj:any,maxTicks:number,par:any,_function:Function=null){
		if (par==null) return;
		let properties:any={};
		let ticks:number=0;

		for (var v in par){
			if (v=="delay"){
				ticks=-par[v];
			}else{
				properties[v]={start:_obj[v],end:par[v],
					incR:Math.floor(par[v]/0x010000)-Math.floor(_obj[v]/0x010000),
					incG:Math.floor((par[v]%0x010000)/0x000100)-Math.floor((_obj[v]%0x010000)/0x000100),
					incB:Math.floor(par[v]%0x000100)-Math.floor(_obj[v]%0x000100),
				};
			}
		}

		
		function _tickThis(){
			ticks+=1;
			if (ticks>maxTicks){
				JME.removeFromTicker(_tickThis);
				if (_function!=null) _function.call(_obj);
			}else if (ticks>=0){
				for (var v in properties){
					_obj[v]=properties[v].start+Math.floor(properties[v].incR/maxTicks*ticks)*0x010000+Math.floor(properties[v].incG/maxTicks*ticks)*0x000100+Math.floor(properties[v].incB/maxTicks*ticks);
				}
			}
		}
		JME.addToTicker(_tickThis);
	}
	
}

class JMBL_Rect extends PIXI.Rectangle{
	setLeft(n:number){
		this.width+=this.x-n;
		this.x=n;
	}

	setRight(n:number){
		this.width+=n-this.right;
	}

	setTop(n:number){
		this.height-=n-this.y;
		this.y=n;
	}

	setBot(n:number){
		this.height+=n-this.top;
	}
}