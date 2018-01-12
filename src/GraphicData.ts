class TextureData{
	static firework:PIXI.Texture;
	static circle:PIXI.Texture;
	static square:PIXI.Texture;
	static smallCircle:PIXI.Texture;
	static mediumCircle:PIXI.Texture;
	static clearCircle:PIXI.Texture;
	static bullet:PIXI.Texture;
	static wall:PIXI.Texture;
	static nova:PIXI.Texture;
	static genericShadow:PIXI.Texture;

	static init(_renderer:any){
		let _graphic:PIXI.Graphics=new PIXI.Graphics;
		_graphic.beginFill(0xffffff);
		_graphic.drawCircle(-25,-25,25);
		this.circle=_renderer.generateTexture(_graphic);

		_graphic=new PIXI.Graphics;
		_graphic.beginFill(0xffffff);
		_graphic.drawCircle(-5,-5,5);
		this.smallCircle=_renderer.generateTexture(_graphic);

		_graphic=new PIXI.Graphics;
		_graphic.beginFill(0,0.3);
		_graphic.drawEllipse(0,0,5,2);
		this.genericShadow=_renderer.generateTexture(_graphic);

		_graphic=new PIXI.Graphics;
		_graphic.beginFill(0xffffff,0.5);
		_graphic.lineStyle(2,0xffffff,0.7);
		_graphic.drawCircle(0,0,25);
		this.clearCircle=_renderer.generateTexture(_graphic);

		_graphic=new PIXI.Graphics;
		_graphic.beginFill(0xffffff);
		_graphic.drawRect(0,0,28,28);
		_graphic.beginFill(0x333333);
		_graphic.drawCircle(14,14,14);
		_graphic.beginFill(0xffffff);
		_graphic.drawCircle(14,14,7);
		this.mediumCircle=_renderer.generateTexture(_graphic);

		_graphic=new PIXI.Graphics;
		_graphic.beginFill(0xffffff);
		_graphic.drawRect(0,0,28,28);
		_graphic.endFill();
		_graphic.lineStyle(5,0x333333);
		_graphic.moveTo(2,2);
		_graphic.lineTo(26,26);
		_graphic.moveTo(26,2);
		_graphic.lineTo(2,26);
		this.wall=_renderer.generateTexture(_graphic);

		_graphic=new PIXI.Graphics;
		_graphic.beginFill(0xffffff);
		_graphic.drawRect(0,0,28,28);
		_graphic.endFill();
		_graphic.lineStyle(5,0x333333);
		_graphic.moveTo(13,2);
		_graphic.lineTo(26,13);
		_graphic.lineTo(13,26);
		_graphic.lineTo(2,13);
		_graphic.lineTo(13,2);
		this.nova=_renderer.generateTexture(_graphic);

		_graphic.clear();
		_graphic.beginFill(0xffffff);
		_graphic.drawRect(0,0,30,30);
		this.square=_renderer.generateTexture(_graphic);

		_graphic.clear();
		_graphic.beginFill(0xffffff);
		_graphic.drawCircle(0,0,2);
		this.bullet=_renderer.generateTexture(_graphic);

		_graphic.clear();
		_graphic.beginFill(0xffffff);
		_graphic.drawCircle(0,0,5);
		this.firework=_renderer.generateTexture(_graphic);

	}
}