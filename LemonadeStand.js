class GUI{

}
class User extends GUI {
	constructor(obj) {
		super();
		var seller = $('<img src="images/Person1.gif"/>').addClass('seller');
		var stage = $("#stage").append(seller);
	}
}
class Today extends GUI {
	constructor(day,player) {
		super();
		//later we can access day.weather to change class / background image based on the weather
		$("body").addClass("sunnyDay"); //this has background scene in it.
		this.day = day;
		this.player = player;
		this.displayWeather();
		this.displayDashboard();
	}
	displayWeather(){
		var temp = $('<div></div>').addClass('temperature').attr( "id", "temp" ).html(this.day.temp + "&deg; F");
		var stage = $("#stage").append(temp);
		temp.fadeOut(5000,"linear",this.weatherDashboard.bind(this,this.day));
	}
	displayDashboard(){
		var money = $('<div></div>').addClass('money').attr( "id", "money" ).html(this.player.formatCash());
		var dashboard = $('<div></div>').addClass('dashboard').attr( "id", "dashboard" );
		
		dashboard.append(money);
		var stage = $("#stage").append(dashboard);

	}
	weatherDashboard(day){
		var temp = $('<div></div>').addClass('money').attr( "id", "dashTemperature" ).html(day.temp + "&deg; F");
		$('#dashboard').append(temp);
		
	}
}
class LemonadePitcher { 
	constructor() {
		this.lemons = new Lemons();
		this.sugar = new Sugar();
		this.lemons.quantity = 5;
		this.sugar.quantity = 3;
		const glassesPerPitcher = 10;
		this.price = 1;
		this.glassesRemainingInPitcher = glassesPerPitcher;
		this.pitcherEmpty = false;
		
	}
	
	isPitcherEmpty(){
		
		console.log(this.glassesRemainingInPitcher);
		if(this.glassesRemainingInPitcher<=0){
			return true;

		}
		return false;
	}
	
} 

class Lemons {
	constructor() {
		this.quantity = 1;
		this.price = 1.0;
	}
}

class Sugar {
	constructor() {
		this.quantity = 1;
		this.price = .5;
	}
}

class Actor {
	constructor (day) {
		this.thirst = Math.random(); //This will return a number between 0 and up to (but not including) 1
		this.willPurchase = this.isPurchasingToday(day);
		console.log("created new actor. will purchase = " + this.willPurchase);
	} 
	isPurchasingToday(day){
		var purchasingChance = this.thirst * day.temp;
		if (purchasingChance > 50) {
			return true;
		}
		return false;		
	}
}

class World{
	constructor(){
		this.residents = 400;
		

	}

}
class Day extends World {
	constructor() {
		super();
		this.minTemp = 50;
		this.maxTemp = 100;
		this.temp = this.pickTemperature();
		this.potentialCustomers = this.residents * (this.temp/100);
		this.hoursPassed = 0;
	}

	pickTemperature(){
		return Math.floor(Math.random() * (this.maxTemp - this.minTemp + 1))+ this.minTemp;
		
	}

	

} 

class Seller {
	constructor() {
		const cashOnStart = 100;
		this.cash = cashOnStart;
		this.pitchers = []; //holds pitchers purchased for the day
		this.todaysBusiness;
		//create customers array
		this.actor;

	}
	buyPitcher() { 
	
		var pitcher = new LemonadePitcher();
		var lemonCost = pitcher.lemons.quantity * pitcher.lemons.price;
		var sugarCost = pitcher.sugar.quantity * pitcher.sugar.price;
		var pitcherCost = sugarCost + lemonCost; 
		
		if(this.cash - pitcherCost < 0){
			console.log("Not enough money to buy pitcher.");
			return {};
		}
		
		
		this.cash -= pitcherCost;
		this.addPitcherToCollection(pitcher);
		return pitcher; 
	}
	formatCash() {
		return "$" + this.cash.toFixed(2);
	}
	addPitcherToCollection(pitcher){
		this.pitchers.push(pitcher);
	}
	removePitcherFromCollection(pitcher){
		this.pitchers.pop();
	}
	pourAGlass(pitcher){
		console.log(pitcher);
		
		pitcher.pitcherEmpty = pitcher.isPitcherEmpty();
		if(pitcher.pitcherEmpty == false){
			console.log(pitcher.glassesPerPitcher);
			pitcher.glassesRemainingInPitcher--;
		}
		else{
			console.log("Your pitcher is empty.");
			this.removePitcherFromCollection(pitcher)
			//check to see if there are other pitchers with lemonade
			pitcher = this.changeOutPitchers();
			if(this.noMorePitchers(pitcher) == true){
				//user is out of pitchers
				this.closeBusinessForDay();
				return {};
			}
			return pitcher;
		
		}
		
	}
	changeOutPitchers(){
		if(this.pitchers.length > 0){
			return this.pitchers[this.pitchers.length - 1]; //returns the last pitcher object
		}
		//otherwise close shop and return empty object
		this.closeBusinessForDay();
		return {};
	}
	noMorePitchers(pitcher){
		if(Object.keys(pitcher).length === 0 && pitcher.constructor === Object){
				//user is out of pitchers
				return true;
		}
		return false;
	}
	checkPitcherForLemonade(pitcher){
		if(pitcher.glassesRemainingInPitcher > 0){
			return true;
		}
		else{
			pitcher.pitcherEmpty = true;
			return false;
		}
	}
	sellLemonade(actor, lemonadeObj){
		console.log("in sell lemonade. actor = " + actor);
		if (actor.willPurchase == true){
			console.log("customer is good to purchase.");
			//pick up the last pitcher
			var pitcher = this.changeOutPitchers();
			//check to see if there's lemonade left
			this.checkPitcherForLemonade(pitcher);
			
			//if some left, 
			//Pour a glass
			if(pitcher.pitcherEmpty == true){
				
				if(Object.keys(lemonadeObj).length === 0 && lemonadeObj.constructor === Object){
					//user is out of pitchers
					console.log("You are out of pitchers. Closing Shop for the day.");
					return false;
				}
				pitcher = this.changeOutPitchers();
				
			}				
			this.pourAGlass(pitcher);

			//check to 
			//deposit money into seller account and notify seller
			this.cash += pitcher.price;
			console.log("Someone bought a glass of lemonade from you for $" + pitcher.price + ". Congratulations!");
			return true;
		}
		console.log("customer is not good to purchase");
	}

	openBusinessForDay(day){
		console.log("Business is open for the day.");
		this.todaysBusiness =  setInterval(this.runBusiness.bind(this,day),1000);
		
}
	
	runBusiness(day){
			console.log("Hour " + Math.ceil(day.hoursPassed++/3)); // 3 ticks per hour
			
			//get total customers for day and divide by 24 for the tick.  Loop through those here.
			for(var i = 0; i < (day.potentialCustomers / 24);i++){
				this.actor = new Actor(day);
				var pitchersRemain = this.sellLemonade(this.actor,this.pitchers); // not the best given we have multiple lemonadePitcher objs, but we need to rediagram these objects anyway.
				if(pitchersRemain == false || day.hoursPassed >=23){
					this.closeBusinessForDay(); //no more pitchers. close shop.
					break;
				}
			}
	
	}

	closeBusinessForDay(){
		//stop the timeinterval and tell seller she ran out of pitchers
		clearInterval(this.todaysBusiness);
		console.log("Business is closed for the day.");
		console.log("At the end of the day, you have " + this.formatCash() + ".");
	}

}


//main code

function main(){
	
	//create day
	var day = new Day();
	
	//create seller (game player)
	var user = new Seller();
	
	//create a gui
	var guiDay = new Today(day, user);
	var guiSeller = new User(user);
	
	/*
	console.log(day.temp);
	console.log(user.formatCash());
	console.log("Today it is " + day.temp + " degrees farenheit.");
	var numberOfPitchers = prompt("How many pitchers would you like to buy?");
	
	for(var counter = 0; counter < numberOfPitchers; counter++){
		var tempObject = user.buyPitcher();
	}
	
	console.log(user.formatCash());

	//instead of world pop, make that a max, and then use a tick for the day. Num of ticks?
	//open business
	user.openBusinessForDay(day);
	*/
}

$( document ).ready(function() {

	main(); //this runs our code
});