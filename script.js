var origBoard;
const human = 'O';
const ai = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
//cells is an array = [td#0.cell, ..., td#8.cell]
function restart() {
    //close the endgame screen
    document.querySelector(".endgame").style.display = "none";
    //set origBoard to be[0,1,2,3,4,5,6,7,8]
	origBoard = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
        //clear all notes and color
		cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        //let user to click
		cells[i].addEventListener('click', turnClick);
	}
}

function turnClick(square) {
    //change the empty box in to notes
    if (typeof origBoard[square.target.id] == 'number') {
    won = turn(square.target.id, human)
    console.log("i am running")
    if (!checkTie()&&!won){//if not ,ai will move
    won = turn(randomMove(), ai);
    console.log("ai running")
    }
    }
}

function turn(squareId, player) {
    //set the value to be "O" or "X" 
    //eg:[0, "O", 2, 3, 4, 5, 6, 7, 8]
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    //each turn we have to check is there any winner
    let won = checkWiner(origBoard, player);
    if (won) gameOver(won);
    return won;
}

function checkWiner(board,player){
    //Jquery may not support reduce??
    //arr.reduce(previousValue,currentValue,currentIndex)
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    let plays = board.reduce((a, e, i) => 
    //if there are "O" or "x" in the array,cancat their INDEX together(check the wincombo)
    //e.g.var array1 = ['a', 'b', 'c'];
    //var array2 = ['d', 'e', 'f'];
    // console.log(array1.concat(array2));
    //Array ["a", "b", "c", "d", "e", "f"]
		(e === player) ? a.concat(i) : a, []/*it is an array */);
    let gameWon = null;
    //[index,win]~e.g[0,[0, 1, 2]]
	for (let [index, win] of winCombos.entries()) {
        //e.g. ['0','1','2'] plays.indexOf('0')=0 ,plays.indexOf('3')=-1
		if (win.every(elem => plays.indexOf(elem) > -1/*if it is true,that means the players node's index match the wincombo */)) {
            gameWon = {index: index, player: player};
            console.log('gamewon',gameWon)
			break;
		}
	}
	return gameWon;
}

function gameOver(won) {
    for(let i of winCombos[won.index]){
        document.getElementById(i).style.background = won.player ==human?"blue":"red";
    }
    for(var i=0 ; i <cells.length;i++){
        //lock the game board
        cells[i].removeEventListener('click',turnClick)
    }
    declareWinner((won.player == human ? "You win!" : "You lose."));
}

function randomMove(){
    // let emptyBox =  origBoard.filter(s=>typeof s == 'number')
    // console.log('emptyBox()[0]',emptyBox()[0])
    let j = Math.floor(Math.random() * randomSquare().length);
    return randomSquare()[j];
}

function randomSquare(){
    let emptyBox =  origBoard.filter(s=>typeof s == 'number')
    console.log('emptyBox',emptyBox)
    return emptyBox
}

function checkTie(){
    console.log("checktie running")
    console.log("randomSquare().length",randomSquare().length)
    //add elseif length=0 but i win
    if (randomSquare().length === 0  ){
        for (let i = 0; i< cells.length ; i++ ){
        console.log("running")
        cells[i].style.backgroundColor = "green";
		cells[i].removeEventListener('click', turnClick);
        }
        return true;
    } 
    return false;
}

function declareWinner(msg) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = msg;
}
restart();