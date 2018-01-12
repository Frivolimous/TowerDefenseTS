enum BuffType{
	BASIC,
	SLOW,
	POISON,
}

class EffectModel{
	constructor(){

	}

	applyTo(_target:WalkingObject){

	}

	getDescription(){

	}
}

class EffectBuff extends EffectModel{
	buff:BuffModel;

	constructor(_buff:BuffModel){
		super();
		this.buff=_buff;
	}

	applyTo(_target:WalkingObject){
		_target.addBuff(this.buff.clone());
	}

	getDescription():string{
		return BuffModel.nameFromType(this.buff.type)+":\n  "+BuffModel.descOfThis(this.buff);
	}
}

class BuffModel{
	target:WalkingObject;
	ticks:number;
	type:BuffType;

	static nameFromType(_type:BuffType){
		switch(_type){
			case BuffType.BASIC: return "Basic";
			case BuffType.POISON: return "Poison";
			case BuffType.SLOW: return "Slow";
		}
	}

	static descOfThis(_buff:BuffModel){
		switch(_buff.type){
			case BuffType.BASIC: return "";
			case BuffType.POISON: return String((_buff as PoisonBuff).getDPS())+" dps for "+facade.toDur(_buff.ticks)+"s";
			case BuffType.SLOW: return "Move reduced by "+String(Math.floor((1-(_buff as SlowBuff).slow)*100))+"%\n  for "+facade.toDur(_buff.ticks)+"s";
		}
	}

	constructor(){
		this.type=BuffType.BASIC;
	}

	addTo(_target:WalkingObject){
		this.target=_target;


		this.onAdd();
	}

	onAdd(){

	}

	onRemove(){

	}

	onUpdate(){

	}

	update=()=>{
		this.ticks-=1;
		this.onUpdate();
	}

	mergeWith(buff:BuffModel){
		this.ticks+=buff.ticks;
	}

	clone():BuffModel{
		let m:BuffModel=new BuffModel;
		m.ticks=this.ticks;
		m.target=this.target;
		return m;
	}

	startVisual(){

	}

	endVisual(){

	}
}

class SlowBuff extends BuffModel{
	slow:number;

	constructor(slow:number,duration:number){
		super();
		this.slow=slow;
		this.ticks=duration;
		this.type=BuffType.SLOW;
	}

	onAdd(){
		(this.target as any).speed*=this.slow;
	}

	onRemove(){
		(this.target as any).speed/=this.slow;
	}

	mergeWith(buff:SlowBuff){
		this.onRemove();
		this.slow=(this.slow*this.ticks+buff.slow*buff.ticks)/(this.ticks+buff.ticks);
		this.ticks+=buff.ticks;
		this.onAdd();
	}

	clone():BuffModel{
		let m:SlowBuff=new SlowBuff(this.slow,this.ticks);
		m.target=this.target;
		return m;
	}

	startVisual(){
		this.target.setTint(0x00aaff);
	}

	endVisual(){
		this.target.setTint(this.target.originalTint);
	}
}

class PoisonBuff extends BuffModel{
	damage:number;
	frequency:number;
	cFrequency:number;

	constructor(damage:number,frequency:number,duration:number){
		super();
		this.damage=damage;
		this.frequency=frequency;
		this.cFrequency=this.frequency;
		this.ticks=duration;
		this.type=BuffType.POISON;
	}

	onUpdate(){
		this.cFrequency-=1;
		if (this.cFrequency<=0){
			this.cFrequency=this.frequency;
			this.target.takeDamage(this.damage);
		}
	}

	mergeWith(buff:PoisonBuff){
		this.onRemove();
		this.damage=(this.damage*this.ticks+buff.damage*buff.ticks*this.frequency/buff.frequency)/(this.ticks+buff.ticks);
		this.ticks+=buff.ticks;
		this.onAdd();
	}

	clone():BuffModel{
		let m:PoisonBuff=new PoisonBuff(this.damage,this.frequency,this.ticks);
		m.target=this.target;
		return m;
	}

	startVisual(){
		this.target.setTint(0x00aa00);
	}

	endVisual(){
		this.target.setTint(this.target.originalTint);
	}

	getDPS():number{
		return this.damage*facade.toPS(this.frequency);
		//return Math.floor(this.damage*600/this.frequency)/10;
	}
}