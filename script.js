const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
context.scale(20,20);
(function(){
//Variables of arena
const arena = {
	playground : (function(w,h){
		const matrix = [];
		while (h--){
			matrix.push(new Array(w).fill(0));
		}
		return matrix;
	})(12,12),
	dropCounter : 0,
	dropInterval : 350,
	lastTime : 0

}
//Variables of snake
const snake = {
	pos: {x:arena.playground[0].length/2|0, y:arena.playground.length/2 |0},
	dir : "E",
	length : 4,
	score: 0,
	accparam: 0,
	food: {xf:0, yf:0},
	init : []
}
//Snake's methods
const snakeMethods = {
	//Create matrix with sneak position
	createInit(){
		snake.init = [];
		for (let i=0; i<snake.length; i++){
			snake.init.push({x: snake.pos.x -i, y:snake.pos.y, dir: snake.dir});
		}
	},
	// Moving snake 
	moveSnake(){
		if (snake.dir === "N"){
			snake.pos.y--;
		} else if (snake.dir === "S"){
			snake.pos.y++;
		} else if (snake.dir === "E"){
			snake.pos.x++;
		} else if (snake.dir === "W"){
			snake.pos.x--;
		}
		//Snake leaving arena and getting back on the other side
		(function (){
			if (snake.pos.x == arena.playground[0].length){
				snake.pos.x=0;
			} else if (snake.pos.y == arena.playground.length){
				snake.pos.y=0;
			} else if (snake.pos.x == -1){
				snake.pos.x=arena.playground[0].length-1;
			} else if (snake.pos.y == -1){
				snake.pos.y=arena.playground.length-1;
			}
		})();
		//Changing snake's matrix to move it
		(function (){
			let A = snake.pos.x;
			let B = snake.pos.y;
			let direction = snake.dir;
			snake.init.pop();
			snake.init.unshift({x:A,y:B, dir:direction});	
		})();
	},
	// Function changing snake after eating
	eat (){
		if (snake.init[0].x === snake.food.xf && snake.init[0].y === snake.food.yf){
			snake.init.unshift( {x : snake.food.xf, y : snake.food.yf} );
			arenaMethods.food();
			snake.length++;
			snake.accparam++;
			// Function accelerating gameplay
			(function (){
				if (snake.accparam >3){
					arena.dropInterval*=0.85;
					snake.accparam = 0;
				}})();
			snake.score++;
			arenaMethods.showScore();
		}
	},
	// Snake colliding handlers
	snakeCollide(){
		let checkarr = snake.init.slice();
		let first = checkarr.splice(0,1);
		checkarr.splice(0,1);
		for (let i = 0; i<checkarr.length;i++){
			if (first[0].x == checkarr[i].x && first[0].y == checkarr[i].y){
				alert('You loose! Your score is '+snake.score+' ! Nicely done!');
				snakeMethods.resetSnake();
			}
		}
	},
	resetSnake(){
		snake.score =0;
		snake.pos.x = arena.playground[0].length/2|0;
		snake.pos.y = arena.playground.length/2 |0;
		snake.length = 4;
		snake.dir = "E";
		snakeMethods.createInit();
		arenaMethods.showScore();
		arena.dropInterval = 350;
		snake.accparam = 0;
	}
};

//Arena's methods
const arenaMethods = {
	//Drawing playground, snake and apples
	draw(){
		//Drawing playground
		context.fillStyle = "#43924a"
		context.fillRect(0,0,canvas.width, canvas.height);
		//Drawing snake
		(function(){
			context.fillStyle = "yellow";
			context.fillRect(snake.init[0].x, snake.init[0].y, 1, 1);
			for (let j = 1; j< snake.init.length; j++){
				context.fillStyle = "green";
				context.fillRect(snake.init[j].x, snake.init[j].y, 1, 1);
			}
		})();
		//Drawing apples
		context.beginPath();
		context.arc(snake.food.xf+0.5,snake.food.yf+0.5, 0.5, 0, 2*Math.PI, false);
		context.fillStyle= "red";
		context.fill();	
	},
	// Showing food on the arena
	food(){
		snake.food.xf = arena.playground[0].length * Math.random() | 0;
		snake.food.yf = arena.playground.length * Math.random() | 0;	
	},
	showScore(){
		document.getElementById('score').innerHTML= snake.score;
	},
	//Update items position and draw it
	update(time =0){
		const deltaTime = time - arena.lastTime;
		arena.lastTime = time;
		arena.dropCounter +=deltaTime;
		if (arena.dropCounter >= arena.dropInterval){
			snakeMethods.moveSnake();
			arena.dropCounter = 0;		
		}
		arenaMethods.draw();
		snakeMethods.eat();
		snakeMethods.snakeCollide();
		requestAnimationFrame(arenaMethods.update);
	}	
}
//Keys event listeners
document.addEventListener('keydown', event => {
	if (event.keyCode == 37){
		if (snake.dir !== "E"){
			snake.dir = "W";
			arena.dropCounter = 0;
			snakeMethods.moveSnake();
		}
	} else if (event.keyCode == 38){
		if (snake.dir !== "S"){
			snake.dir = "N";
			arena.dropCounter = 0;
			snakeMethods.moveSnake();
		}
	} else if (event.keyCode == 39){
		if (snake.dir !== "W"){
			snake.dir = "E";
			arena.dropCounter = 0;
			snakeMethods.moveSnake();
		}
	} else if (event.keyCode == 40){
		if (snake.dir !== "N"){
			snake.dir = "S";
			arena.dropCounter = 0;
			snakeMethods.moveSnake();
		}
	} 	
});

//Functions first run
snakeMethods.createInit();
snakeMethods.snakeCollide();
arenaMethods.update();
arenaMethods.food();
arenaMethods.showScore();
})();