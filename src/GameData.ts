enum BuildingType{
	BASIC,
	NOVA,
	ICE,
	POISON,
	WALL,
}

enum PriorityType{
	FIRST,
	LAST,
	CLOSEST,
	STRONGEST,
	WEAKEST,
	ANY,
	NONE,
}

enum WalkingType{
	RUNNER,
	FLYER,
}

class BuildingData{
	BASIC:any={name:"Basic",texture:TextureData.mediumCircle,tint:0x0000cc,speed:4,cooldown:50,range:100,damage:5,effects:[],goa:TwoOptions.Both};

}