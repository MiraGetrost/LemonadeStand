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
		if(this.glassesPerPitcher==0){
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
	} 
	isPurchasingToday(day){
		var purchasingChance = this.thirst * day.temp;
		if (purchasingChance > 50) {
			return true;
		}
		return false;		
	}
}

class Day {
	constructor() {
		this.minTemp = 50;
		this.maxTemp = 100;
		this.temp = this.pickTemperature();
		
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
			pitcher.glassesRemainingInPitcher--;
		}
		else{
			console.log("Your pitcher is empty.");
			this.removePitcherFromCollection(pitcher)
			//check to see if there are other pitchers with lemonade
			pitcher = this.changeOutPitchers();
			if(this.noMorePitchers(pitcher) == true){
				//user is out of pitchers
				return {};
			}
			return pitcher;
		
		}
		
	}
	changeOutPitchers(){
		if(this.pitchers.length > 0){
			return this.pitchers[this.pitchers.length - 1]; //returns the last pitcher object
		}
		//otherwise return empty object
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
	actorsPurchaseLemonade(actors, lemonadeObj){
		actors.forEach(item => this.sellLemonade(item, lemonadeObj));
	} 
	sellLemonade(actor, lemonadeObj){
		if (actor.willPurchase == true){
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
	}

}


//main code

function main(){
	const worldPopulation = 100
	//create seller
	var user = new Seller();
	console.log(user.cash);
	var day = new Day();
	console.log(day.temp);
	var george = new Actor(day);
	console.log(george.willPurchase);
	user.buyPitcher();
	console.log(user.formatCash());
	console.log("Today it is " + day.temp + " degrees farenheit.");
	var numberOfPitchers = prompt("How many pitchers would you like to buy?");
	
	for(var counter = 0; counter < numberOfPitchers; counter++){
		var tempObject = user.buyPitcher();
	}
	
	console.log(user.formatCash());
	//create actors
	var actors = [];
	for(var counter = 0; counter < worldPopulation; counter++){
		actors[counter] = new Actor(day);
		var pitchersRemain = user.sellLemonade(actors[counter],user.pitchers); // not the best given we have multiple lemonadePitcher objs, but we need to rediagram these objects anyway.
		if(pitchersRemain == false){
			break; //no more pitchers. close shop.
		}
	}
	console.log("At the end of the day, you have " + user.formatCash() + ".");
}

main(); //this runs our code