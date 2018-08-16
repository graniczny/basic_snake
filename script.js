
const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
context.scale(20,20);

//Create a playground
function createMatrix(w,h){
	const matrix = [];
	while (h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

const arena = createMatrix(12,12);

//Create matrix with sneak position
var init = [];
function createInit(){
	init = [];
	for (let i=0; i<snake.length; i++){
		init.push({x: snake.pos.x -i, y:snake.pos.y, dir: snake.dir});
	}
}
//Drawing playground, snake and apples
function draw(){
	context.fillStyle = "#43924a"
	context.fillRect(0,0,canvas.width, canvas.height);

	drawSnake();

	context.beginPath();
	context.arc(xf+0.5,yf+0.5, 0.5, 0, 2*Math.PI, false);
	context.fillStyle= "red";
	context.fill();
	
};
//Drawing snake
function drawSnake(){
	
	context.fillStyle = "yellow";
	context.fillRect(init[0].x, init[0].y, 1, 1);


	for (let j = 1; j< init.length; j++){
		context.fillStyle = "green";
		context.fillRect(init[j].x, init[j].y, 1, 1);
	}
}
//Update items position and draw it
let dropCounter = 0;
let dropInterval = 350;
let lastTime = 0;

function update(time =0){
	const deltaTime = time - lastTime;
	lastTime = time;
	dropCounter +=deltaTime;
	
	if (dropCounter >= dropInterval){
		moveSnake();
		dropCounter = 0;		
	}
	
	
	draw();
	eat();
	snakeCollide();
	
	requestAnimationFrame(update);
}
// Moving snake 
function moveSnake(){
	if (snake.dir === "N"){
		snake.pos.y--;
	} else if (snake.dir === "S"){
		snake.pos.y++;
	} else if (snake.dir === "E"){
		snake.pos.x++;
	} else if (snake.dir === "W"){
		snake.pos.x--;
	}
	snakeTp();
	snakeChanger();

}
//Changing snake's matrix to move it
function snakeChanger(){
	let A = snake.pos.x;
	let B = snake.pos.y;
	let direction = snake.dir;

	init.pop();
	init.unshift({x:A,y:B, dir:direction});	
}
//Snake leaving arena and getting back on the other side
function snakeTp(){
	if (snake.pos.x == arena[0].length){
		snake.pos.x=0;
	} else if (snake.pos.y == arena.length){
		snake.pos.y=0;
	} else if (snake.pos.x == -1){
		snake.pos.x=arena[0].length-1;
	} else if (snake.pos.y == -1){
		snake.pos.y=arena.length-1;
	}
}
// Showing food on the arena
let xf, yf;

function food(){
	xf = arena[0].length * Math.random() | 0;
	yf = arena.length * Math.random() | 0;
	
	
}
// Function changing snake after eating
function eat (){
	if (init[0].x === xf && init[0].y === yf){
		init.unshift( {x : xf, y : yf} );
		food();
		snake.length++;
		accparam++;
		acceleration();
		snake.score++;
		showScore();
	}
}

function showScore(){
	document.getElementById('score').innerHTML= snake.score;
}
// Function accelerating gameplay
var accparam = 0;
function acceleration(){
	if (accparam >3){
		dropInterval*=0.85;
		accparam = 0;
	}
}
// Snake colliding handlers
function snakeCollide(){
	let checkarr = init.slice();

	let first = checkarr.splice(0,1);
	
	checkarr.splice(0,1);
	
	for (let i = 0; i<checkarr.length;i++){
		
		if (first[0].x == checkarr[i].x && first[0].y == checkarr[i].y){
			alert('You loose! Your score is '+snake.score+' ! Nicely done!');
			resetSnake();
		}
	}
}
function resetSnake(){
	snake.score =0;
	snake.pos.x = arena[0].length/2|0;
	snake.pos.y = arena.length/2 |0;
	snake.length = 4;
	snake.dir = "E";
	createInit();
	showScore();
	dropInterval = 350;
}	
//Keys event listeners
document.addEventListener('keydown', event => {
	if (event.keyCode == 37){
		if (snake.dir !== "E"){
			snake.dir = "W";
			dropCounter = 0;
			moveSnake();
		}
	} else if (event.keyCode == 38){
		if (snake.dir !== "S"){
			snake.dir = "N";
			dropCounter = 0;
			moveSnake();
		}
	} else if (event.keyCode == 39){
		if (snake.dir !== "W"){
			snake.dir = "E";
			dropCounter = 0;
			moveSnake();
		}
	} else if (event.keyCode == 40){
		if (snake.dir !== "N"){
			snake.dir = "S";
			dropCounter = 0;
			moveSnake();
		}
	} 
	
});

//Variables of snake
var snake = {
	pos: {x:arena[0].length/2|0, y:arena.length/2 |0},
	dir : "E",
	length : 4,
	score: 0
}
//Functions first run
createInit();
snakeCollide();
update();
food();
showScore();