# agar-lvlgen

#### Patched
It seems like agar.io now patched the ability that you can log in with a facebook account multiple times, sorry everybody.<br />
I will probably make an update where just one bot plays for you, but with better AI.<br />
I recommend setting your bot limit to 1 until the update.

## Tutorial
###### How-To:
1. Get your Facebook-Cookies, and put them into the config.
2. Edit the config
3. Run Start.bat (on windows) or run it through a terminal

## Config
###### How to edit your config:
When you have your cookies, replace them in the config to make it farm for your account.
Aditionally, you can specify the name of your bots, the amount and more.

When you first downloaded the lvlgen, your config should look something like this:
```
module.exports = {
	// Required
	c_user: "c_user",
	datr: "datr",
	xs: "xs",
	
	// Optional
	name: "agar-lvlgen",
	
	// Advanced
	botLimit: 200,
	spawnDelay: 100,
	servers: {ffa: true, teams: false, experimental: true, party: true},
	regions: ["BR-Brazil", "CN-China", "EU-London", "JP-Tokyo", "RU-Russia", "SG-Singapore", "TK-Turkey", "US-Atlanta"],
	statusDelay: 1000
}
```
In order to make it work you only need to replace ```c_user```, ```datr``` and ```xs``` with your cookies.
All other options are optional.

## Cookies
###### How to get your Facebook token:
1. Get this extension: http://www.editthiscookie.com/
2. Go to facebook.com, click on the cookie and copy the values of datr and so on.

## Planned features
* G+ account support
* Easier config
* More options
* Better AI
* GUI

[Submit suggestions/issues here](../../issues)

## License
[MIT](/LICENSE.md)
