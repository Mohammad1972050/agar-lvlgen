module.exports = {
	// Required
	
	accounts: [
		{
			c_user: "c_user",
			datr: "datr",
			xs: "xs"
		}
	],
	
	name: "agar-lvlgen",
	
	// Advanced
	regions: ["BR-Brazil", "CN-China", "EU-London", "JP-Tokyo", "RU-Russia", "SG-Singapore", "TK-Turkey", "US-Atlanta"],
	statusDelay: 1000,
	
	/* Possible values:
	 *
	 * default: Primitive "AI", low cpu usage
	 * apos: Smart AI, higher cpu usage (still buggy)
	 * 
	*/
	ai: "default"
}