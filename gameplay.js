// THE COMMENTS ARE TO PROVIDE SOME EXPLANATIONS FOR EACH FUNCTIONS 
// REMEMBER THAT THE PURPOSE OF THIS MINI APP IS TO SUPPORT LOCAL BUSINESS WHILE PLAYING! SO ADD MORE FEATURES! 
// HAVE FUN! 

var gameBoard = {
// SETTING UP A GAMEBOARD WITH INITIAL VALUES OF 0 
// THE FIRST NUMBER REPRESENTS THE ROW AND THE SECOND NUMBER REPRESENTS THE COLUMN
    "00": { value: 0 },
    "01": { value: 0 }, 
    "02": { value: 0 },
    "03": { value: 0 },

    "10": { value: 0 },
    "11": { value: 0 },
    "12": { value: 0 },
    "13": { value: 0 },
    
    "20": { value: 0 },
    "21": { value: 0 },
    "22": { value: 0 },
    "23": { value: 0 },

    "30": { value: 0 },
    "31": { value: 0 },
    "32": { value: 0 },
    "33": { value: 0 }
	
};

var unicorn = document.getElementById;

// LOADING PICTURES INTO AN OBJECT, EACH CORRESPONDING WITH A NUMBER
var pictures = {
    2:      "https://www.qoom.cloud/jonny/Images/2.png",
    4:      "https://www.qoom.cloud/jonny/Images/4.png",
    8:      "https://www.qoom.cloud/jonny/Images/8.png",
    16:     "https://www.qoom.cloud/jonny/Images/16.png",
    32:     "https://www.qoom.cloud/jonny/Images/32.png",
    64:     "https://www.qoom.cloud/jonny/Images/64.png",
    128:    "https://www.qoom.cloud/jonny/Images/128.png",
    256:    "https://www.qoom.cloud/jonny/Images/256.png",
    512:    "https://www.qoom.cloud/jonny/Images/512.png",
    1024:   "https://www.qoom.cloud/jonny/Images/1024.png",
    2048:   "https://www.qoom.cloud/jonny/Images/2048.png",
    4096:   "https://www.qoom.cloud/jonny/Images/4096.png",
    8192:   "https://www.qoom.cloud/jonny/Images/8192.png",
    /*16384:  "https://www.qoom.cloud/jonny/Images/32.png",
    32768:  "https://www.qoom.cloud/jonny/Images/32.png",
    65536:  "https://www.qoom.cloud/jonny/Images/32.png",
    131072: "https://www.qoom.cloud/jonny/Images/32.png"*/
};

var imageData = {};

// HAMMER https://hammerjs.github.io/
var manager = new Hammer.Manager(document.body);
var Swipe = new Hammer.Swipe();

var points = 0;

var canvas = document.querySelector('canvas');
var tools = canvas.getContext('2d');

var bestscore =  localStorage.getItem('bestscoreitem')*1 || 0;

var $scorekeeper = document.querySelector('#score');

var $bestscore = document.querySelector('#bestscore');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function loadImages() {
	/*console.log(Object.keys(pictures))*/
	Object.keys(pictures).forEach(function(score) {
		var url = pictures[score];
		var image = new Image();
		image.onload = function() {
			canvas.width = image.width;
			canvas.height = image.height;
			tools.drawImage(image, 0,0,image.width, image.height);
			imageData[score] = canvas.toDataURL();			
		};
		image.src = url;
	});
}
 
function drawBoard() {
	/*console.log(Object.keys(gameBoard))*/
    var cellNumbers = Object.keys(gameBoard);
    cellNumbers.forEach(function(cellNumber) {
        var tdElement = document.getElementById(cellNumber);
        var score = gameBoard[cellNumber].value;
        if(score === 0){
            tdElement.style.backgroundImage = 'none';
            tdElement.innerHTML = '';
            return;
        }
        var c = '';
        var before = gameBoard[cellNumber].before;
        if(before) {
        	
        	
        	
            var xa = parseInt(cellNumber[1]);
            var ya = parseInt(cellNumber[0]);
            var xb = parseInt(before[1]);
            var yb = parseInt(before[0]);
            
            console.log(xa + ' ' + ya + ' ' + xb + ' ' +yb)
            
            if(xa !== xb) {
                c = 'x' + (xb - xa);
            } else {
                c = 'y' + (yb - ya);
            }
        } else if(gameBoard[cellNumber].spawn) {
            c = 'spawn';
        }
        
        
        var imgUrl = imageData[score] || pictures[score];
        tdElement.innerHTML = '<div class=' + c +' style="background-image:url(' + imgUrl +  ')"><span>' + score + '</span></div>';
        if(gameBoard[cellNumber].merged) {
            tdElement.querySelector('div').classList.add('merge');
            handleScore(score);
        }
    });
}

// CHOOSE A RANDOM CELL TO ADD A NUMBER: EITHER 2 OR 4, WITH A GREATER CHANCE OF GETTING A 2---------34359738368
function choosenumber(){
    var options = [2,2,2,4];
    var randomIndex = Math.floor(Math.random()*4);
    var randint = options[randomIndex];
    var emptyCellNumbers = Object.keys(gameBoard).filter(function(cellNumber){
        return gameBoard[cellNumber].value === 0;
    });
    randomIndex = Math.floor(Math.random()*emptyCellNumbers.length);
    var randomCell = emptyCellNumbers[randomIndex];
    // IF THE RANDOM CELL NUMBER IS INVALID, THEN CHECK FOR GAME OVER 
    if(!gameBoard[randomCell]){
        if(isItDoomsday()) {
            alert('game over');
            //document.getElementById('record').style.display = 'block';
            location.reload();
        }
        return;
    }
    gameBoard [randomCell].value = randint;
    gameBoard [randomCell].spawn = true;
}

// A FUNCTION TO CHECK IF GAME IS OVER   
function isItDoomsday() {
    var cellNumbers = Object.keys(gameBoard);
    // THE DEFAULT STATE OF "WHETHER GAME OVER OR NOT" IS TRUE, WILL ALTER IT IN THE FUNCTION LATER
    var itIsDoomsday = true;
    cellNumbers.forEach(function(cellNumber) {
        var aklj = gameBoard[cellNumber].value;
        var row = cellNumber[0]*1;
        var col = cellNumber[1]*1;
        var above = (row - 1) + '' + col;
        var below = (row + 1) + '' + col;
        var left = row + '' + (col - 1);
        var right = row + '' + (col + 1);
        if(
        	// IF ANY OF THE TWO NEIGHBOURING BLOCKS HAVE THE SAME VALUE, THEN THE GAME IS NOT OVER, THE USER CAN STILL MOVE
            (gameBoard[above] && aklj === gameBoard[above].value) ||
            (gameBoard[below] && aklj === gameBoard[below].value) ||
            (gameBoard[right] && aklj === gameBoard[right].value) ||
            (gameBoard[left] && aklj === gameBoard[left].value)
        ) {
            itIsDoomsday = false;
        }
    });
    return itIsDoomsday;
}

function slide(direction) {

    var columnsOrRows = findColumnsOrRows(direction);
    var mergedArrays = slideAndMerge(columnsOrRows, direction);
    fillInGameBoard(mergedArrays, columnsOrRows, direction);

    choosenumber();
    drawBoard();

}

function findColumnsOrRows(direction) {
    var arrays = [];
    if (direction === 'up' || direction === 'down') {
        // EACH ITEM ARE THE PROPERTIES OF THE 4 COLUMNS IN OUR GAME BOARD
        arrays = [
            ['00', '10', '20', '30'],
            ['01', '11', '21', '31'],
            ['02', '12', '22', '32'],
            ['03', '13', '23', '33']
        ];
    } else {
        // EACH ITEM ARE THE PROPERTIES OF THE 4 ROWS IN OUR GAME BOARD
        arrays = [
            ['00', '01', '02', '03'],
            ['10', '11', '12', '13'],
            ['20', '21', '22', '23'],
            ['30', '31', '32', '33']
        ];
    }
    return arrays;
}

function slideAndMerge(arrays, direction) {
// WE NEED TO SLIDE THE NUMBERS IN THE RIGHT DIRECTION AND MERGE THEM IF THEY ARE THE SAME
    var mergedCells = [];
    
    // WE NEED TO DEFINE WHAT DIRECTION TO SLIDE IN OUR ROW OR COLUMN
    var beforeOrAfter = direction === 'up' || direction === 'left' ? 'after' : 'before';
    var method = beforeOrAfter === 'after' ? 'push' : 'unshift';
    var indices = beforeOrAfter === 'after' ? [0,1,2,3] : [3,2,1,0];
    arrays.forEach(function(array) {
        var outputList = [];
        indices.forEach(function(index) {
            var position = array[index];
            
            // CREATING A CELL THAT WILL BE SLID AND MERGED
            var cell = { 
                value: gameBoard[position].value, // GRABBING THE VALUE FROM THE GAMEBOARD
                before: position                  // STORING THE ORIGINAL GAMEBOARD POSITION
            };
            
            //IF THE GAMEBOARD AT THE POSITION HAS NO VALUE, THERE IS NOTHING TO SLIDE
            if(cell.value === 0) {
                return;
            }
            
            var topMostValue = cell.value;
            var bottomOfTheOutputList = beforeOrAfter === 'after' ? outputList[outputList.length - 1] : outputList[0];
            
            //ADDING THE GAMEBOARD CELL TO OUR OUTPUT LIST IF THERE IS NOTHING IN THE OUTPUT LIST
            if(!bottomOfTheOutputList) {
                outputList[method](cell);
                return;
            }
            
            //ADDING THE GAMEBOARD CELL TO THE OUTPUT LIST IF THE ONE BEFORE IT HAS ALREADY BEEN MERGED
            if(bottomOfTheOutputList.merged) {
                outputList[method](cell);
                return;
            }
            
            //MERGING THE CELLS IF THE VALUES ARE THE SAME
            if(topMostValue === bottomOfTheOutputList.value) {
                bottomOfTheOutputList.value *= 2;
                bottomOfTheOutputList.merged = true;
                return;
            }
            
            // ADDING THE GAMEBOARD TO THE CELL IF THEY DIDNT MERGE
            outputList[method](cell);
        });
        mergedCells.push(outputList);
    });
    return mergedCells;

}

function fillInGameBoard(mergedArrays, columnsOrRows, direction) {

    // ADDING THE ZEROS IN OUR MERGED ARRAYS
    var arraysWithZeros = [];
    var beforeOrAfter = direction === 'up' || direction === 'left' ? 'after' : 'before';
    mergedArrays.forEach(function(mergedArray, index) {
        while(mergedArray.length < 4) {
            if(beforeOrAfter === 'after') {
                mergedArray.push({value: 0});
            } else {
                mergedArray.unshift({value: 0});
            }
        }
        arraysWithZeros.push(mergedArray);
    });
    
    //POPULATING OUR GAMEBOARD
    columnsOrRows.forEach(function(columnOrRow, arrayIndex) {
        columnOrRow.forEach(function(position, index) {
            gameBoard[position] = arraysWithZeros[arrayIndex][index];
        });
    });

}

// HANDLE KEY PRESSES 
function handleKeyEvent(key) {
    if(key.code === 'ArrowUp') {
            slide('up');
        }
    if(key.code === 'ArrowDown') {
        slide('down');
        }
    if(key.code === 'ArrowLeft') {
        slide('left');
    }
    if(key.code === 'ArrowRight') {
        slide('right');
    }
}

// KEEP THE APP FROM REFRESHING ITSELF
function preventDefault(e) {

  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  

}
 
function handleSwipe(swipe) {

     if(swipe.direction === 8) {
        slide('up');
    } else if(swipe.direction === 16) {
        slide('down');
    } else if(swipe.direction === 4) {
        slide('right');
    } else if(swipe.direction === 2) {
        slide('left');
    } else {
        return;
    }    

}

// KEEP TRACK OF THE SCORE 
function handleScore(score) {
    points += score;
    $scorekeeper.innerHTML = points;
    bestscore = Math.max(points, localStorage.getItem('bestscoreitem')*1 ||bestscore)
    localStorage.setItem('bestscoreitem',bestscore);
    $bestscore.innerHTML = bestscore;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// https://hammerjs.github.io/recognizer-swipe/ 
// HAMMER PACKAGE FUNCTION, USING SWIPE TO ANIMATE THE MOTIONS
var manager = new Hammer.Manager(document.body);
var Swipe = new Hammer.Swipe()

manager.add(Swipe);
manager.on('swipe', handleSwipe);

document.ontouchstart = function(e){ 
    preventDefault(e);
};

window.onwheel = preventDefault; 
window.onmousewheel = preventDefault;
document.onmousewheel = preventDefault;
window.ontouchmove  = preventDefault;
document.onmousewheel = preventDefault;
window.ontouchstart  = preventDefault;
document.ontouchstart  = preventDefault;

window.addEventListener('keydown', handleKeyEvent);
var notSelfGameStop = true;
var randomNum = Math.floor(Math.random()*4);
//SELF PLAYING GAME
async function selfPlay(){
while (notSelfGameStop){
	randomNum = Math.floor(Math.random()*4);
	console.log(randomNum);
	//await sleep(500);
	//slide('up');
	if(randomNum==1){
		slide('up')
	}
	else if(randomNum==2){
		slide('down')
	}
	else if(randomNum==3){
		slide('left')
	}
	else if(randomNum==4){
		slide('right')
	}
	else{
		slide('down')
	}
    await sleep(500);
    //slide('left');
    //await sleep(500);
            if (isItDoomsday()){
                notSelfGameStop = false;
                //await sleep(1000);
                location.reload();
            }
}
}

async function selfPlay2(){
while (notSelfGameStop){
	randomNum = Math.floor(Math.random()*4);
	console.log(randomNum);
	slide('up');
    await sleep(500);
    slide('left');
    await sleep(500);
            if (isItDoomsday()){
                notSelfGameStop = false;
                //await sleep(1000);
                location.reload();
            }
}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// CALL FUNCTIONS 
loadImages();
choosenumber();
choosenumber();
drawBoard();
handleScore(points);