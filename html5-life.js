/*
 * Michael Hannemann -- <lastname>@pobox.com
 */

/* global data */
var gCanvasElement;
var gDrawingContext;

var gStepCountElem;
var gLogElem;

/* data arrays -- create once and then swap between them */
var gData0;
var gData1;

var gNumIter = 0;

var gLastStateHash = 0;
var gLastStateHash2 = 0;

/* constants which control drawing size */

var kBoardWidth = 60;
var kBoardHeight = 60;
var kCellWidth = 10;
var kCellHeight = 10;
var kPixelWidth = 1 + (kBoardWidth * kCellWidth);
var kPixelHeight = 1 + (kBoardHeight * kCellHeight);

var kSleepInterval = 200;   /* ms */

function getCurrentBoard() {
    if (gNumIter % 2 == 0) {
	return gData0;
    } else {
	return gData1;
    }
}

function getNextBoard() {
    if (gNumIter % 2 == 0) {
	return gData1;
    } else {
	return gData0;
    }
}

function logMsg(msg) {
    gLogElem.innerHTML = gLogElem.innerHTML + "<br>" + msg;
}

function getCellState(board, x, y) {
    /* wrap around too */
    var xx = (x + kBoardWidth) % kBoardWidth;
    var yy = (y + kBoardHeight) % kBoardHeight;

    return board[xx][yy];
}

function setCellState(board, x, y, value) {
    var xx = (x + kBoardWidth) % kBoardWidth;
    var yy = (y + kBoardHeight) % kBoardHeight;
    board[xx][yy] = value;
}

function drawBoard() {
    /* reset canvas */
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    var board = getCurrentBoard();

    /* highlight live squares */
    for (var i = 0; i < kBoardWidth; i++) {
	for (var j = 0; j < kBoardHeight; j++) {
	    if (getCellState(board, i, j) == 1) {
		gDrawingContext.fillStyle = "rgb(0,255,0)";
		gDrawingContext.fillRect(i*kCellWidth, j*kCellHeight, kCellWidth, kCellHeight);
	    }
	}
    }

    /* draw lines */
    gDrawingContext.beginPath();

    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kCellWidth) {
	gDrawingContext.moveTo(0.5 + x, 0);
	gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }

    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kCellHeight) {
	gDrawingContext.moveTo(0, 0.5 + y);
	gDrawingContext.lineTo(kPixelWidth, 0.5 + y);
    }

    /* draw it */
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
}

function createBoard() {
    var board = [];
    for (var i = 0; i < kBoardWidth; i++) {
	var column = [];
	for (var j = 0; j < kBoardHeight; j++) {
	    /* 0 means off */
	    column.push(0);
	}
	board.push(column);
    }
    return board;
}

function initData() {
    gData0 = createBoard();
    gData1 = createBoard();
}

function countNeighbors(board, i, j) {
    var l = getCellState(board, i-1, j);
    var r = getCellState(board, i+1, j);
    var u = getCellState(board, i, j-1);
    var d = getCellState(board, i, j+1);
    var ul = getCellState(board, i-1, j-1);
    var ur = getCellState(board, i+1, j-1);
    var dl = getCellState(board, i-1, j+1);
    var dr = getCellState(board, i+1, j+1);
    return l + r + u + d + ul + ur + dl + dr;
}

function logBoard(board) {
    for (var i=0; i < kBoardWidth; i++) {
	logMsg(board[i]);
    }
}

function goToNextState () {
    /* the heart of Life */
    
    var currentBoard = getCurrentBoard();
    var nextBoard = getNextBoard();

    /* iterate over old state, set new -- crude but should work */
    for (var i = 0; i < kBoardWidth; i++) {
	for (var j = 0; j < kBoardHeight; j++) {
	    var sum = countNeighbors(currentBoard, i, j);
	    var me = getCellState(currentBoard, i, j);
	    if (me == 1) {
		/* live cells with exactly 2 or 3 neighbors live on */
		if (sum == 2 || sum == 3) {
		    /* alert('Setting something to be true'); */
		    setCellState(nextBoard, i, j, 1);
		} else {
		    /* no real need to set this as it defaults to 0 */
		    setCellState(nextBoard, i, j, 0);
		}
	    } else {
		if (sum == 3) {
		    /* dead cells with exactly 3 neighbors grow life */
		    setCellState(nextBoard, i, j, 1);
		} else {
		    /* no real need to set this as it defaults to 0 */
		    setCellState(nextBoard, i, j, 0);
		}
	    }
	}
    }
}

/* Several functions to create initial patterns. */

/*
  0        1         2         3
  123456789012345678901234567890123456
1 ........................O........... 1
2 ......................O.O........... 2
3 ............OO......OO............OO 3 
4 ...........O...O....OO............OO 4
5 OO........O.....O...OO.............. 5 
6 OO........O...O.OO....O.O........... 6
7 ..........O.....O.......O........... 7
8 ...........O...O.................... 8
9 ............OO...................... 9

// and the Eater:
* OO..
* O...
* .OOO
* ...O
*/

function createData1() {
    // Gosper Glider Gun -- http://www.argentum.freeserve.co.uk/lex_g.htm#gosperglidergun
    board = getCurrentBoard();
    board[1][5] = board[2][5] = board[1][6] = board[2][6] = 1;
    board[35][3] = board[35][4] = board[36][3] = board[36][4] = 1;
    board[13][3] = board[12][4] = board[11][5] = board[11][6] = board[11][7] = board[12][8] = board[13][9] = 1;
    board[14][3] = board[16][4] = board[17][5] = board[17][6] = board[17][7] = board[16][8] = board[14][9] = 1;
    board[15][6] = board[18][6] = 1;
    board[25][1] = board[25][2] = board[23][2] = board[23][6] = board[25][6] = board[25][7] = 1;
    board[21][3] = board[22][3] = board[21][4] = board[22][4] = board[21][5] = board[22][5] = 1;
    // and terminate with an Eater -- http://www.chaos.org.uk/~eddy/craft/weblife.html
    board[5][52] = board[6][52] = board[5][53] = 1;
    board[6][54] = board[7][54] = board[8][54] = board[8][55] = 1;

    return "Gosper Glider Gun (plus an Eater)";
}

function createData2() {
    /* acorn */
    board = getCurrentBoard();
    board[22][21] = 1;
    board[22][23] = 1;
    board[21][23] = 1;
    board[24][22] = 1;
    board[25][23] = 1;
    board[26][23] = 1;
    board[27][23] = 1;
    return "acorn";
}

function createData3() {
    /* "block-laying switch engine"? */
    board = getCurrentBoard();
    board[21][26] = 1;
    board[23][26] = 1;
    board[23][25] = 1;
    board[25][24] = 1;
    board[25][23] = 1;
    board[25][22] = 1;
    board[27][23] = 1;
    board[27][22] = 1;
    board[27][21] = 1;
    board[28][22] = 1;
    return "block-laying switch engine";
}

function createData4() {
    board = getCurrentBoard();
    for (var i=15; i <= 45; i++) {
	board[i][30] = 1;
    }
    return "line";
}

function createData5() {
    /* "Lidka" -- http://www.conwaylife.com/wiki/index.php?title=Lidka */
    board = getCurrentBoard();
    board[22][23] = board[23][22] = board[24][23] = board[23][24] = 1;
    board[30][32] = board[30][33] = board[30][34] = 1;
    board[26][36] = board[27][36] = board[28][36] = 1;
    board[28][33] = board[28][34] = board[27][34] = 1;
    return "Lidka - a Methuselah";
}

function randomBoardInit() {
    board = getCurrentBoard();
    for (var i = 0; i < kBoardWidth; i++) {
	for (var j = 0; j < kBoardHeight; j++) {
	    board[i][j] = Math.floor(Math.random() * 2);
	}
    }
    return "random";
}

function createData() {
    // Let's do known patterns sometimes, and random slightly less than half.
    // Oh, except let's also prefer the glider gun more often than not.

    var choice = Math.floor(Math.random() * 11);
    var name;
    switch (choice) {
    case 0: 
    case 1:
    case 2:
    case 3:
	name = createData1();
	break;
    case 4:
	name = createData2();
	break;
    case 5:
	name = createData3();
	break;
    case 6:
	name = createData4();
	break;
    case 7:
	name = createData5();
	break;
    default:
	name = randomBoardInit();
	break;
    }
    return name;
}

function calculateStateHash() {
    /* let's pick a way to figure out if we can stop iterating */
    /* this is not particularly good, need better algorithm with fewer collisions */
    var sum = 0;
    var board = getCurrentBoard()
    for (var i = 0; i < kBoardWidth; i++) {
	for (var j = 0; j < kBoardHeight; j++) {
	    if (board[i][j] == 1) {
		sum += (Math.log(i) * 10000 + Math.log(j));
	    }
	}
    }
    return sum;
}

function shouldKeepGoing() {
    /* calculateStateHash not doing its job -- just go for ever. */
    return true;

    /*
    // iterate state hash vars stop if we're ever static or in a 2-step repeat
    var curStateHash = calculateStateHash();
    if (curStateHash != gLastStateHash && curStateHash != gLastStateHash2) {
	gLastStateHash2 = gLastStateHash
	gLastStateHash = curStateHash;
	return true;
    } else { 
        // logMsg('Stopping because curStateHash = ' + curStateHash + ' which matches either ' + gLastStateHash + ', ' + gLastStateHash2); 
        logMsg('Stopping because we have reached statis (we think).'); 
	return false;
    }
    */
}

/* Run until we think we should stop. */

function runLoop () {
    drawBoard();
    gStepCountElem.innerHTML = gNumIter;
    goToNextState();
    gNumIter++;

    if (shouldKeepGoing()) {
	setTimeout(runLoop, kSleepInterval);
    }
}

/* Initialize everything and start the game running. */

function initGame(canvasElement) {
    gCanvasElement = canvasElement;
    gDrawingContext = canvasElement.getContext("2d");
    canvasElement.width = kPixelWidth;
    canvasElement.height = kPixelHeight;

    gStepCountElem = document.getElementById('itercount');
    gLogElem = document.getElementById('logdata');

    initData();
    var patternName = createData();
    document.getElementById('patternName').innerHTML = "Pattern name: " + patternName;

    runLoop();
}
