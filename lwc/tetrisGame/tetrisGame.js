import { LightningElement } from 'lwc';

//Variables
const width = 10;
let nextRandom = 0;
let grid;
let squares;
let scoreDisplay;
let score = 0;
const colors = ['orange', 'red', 'purple', 'green', 'blue'];
/*
INDEX explained:
width = 10
[1, width+1, width*2+1, 2]

after factoring in width:
=[01, 11, 21, 02]

taking those numbers as x and y values:
=[(0, 1), (1, 1), (2, 1), (0, 2)
]

the x and y values indicate which box to colour.

[0,0]  [0,1]  [0,2]
[1,0]  [1,1]  [1,2]
[2,0]  [2,1]  [2,2]
*/
//Define Tetromino Shape
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetrominoes.length);
let currentTetromino = theTetrominoes[random][currentRotation];
let timerId;
const tetrisFunctions = new TetrisFunctionality();

//Variables for mini-grid
const displayWidth = 4;
let displaySquares;
let displayIndex = 0;
//Tetrominoes without rotation
const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
];

const nextTetrominoObj = new NextTetromino();

//Variables for Start/Pause functionality
let startButton;

export default class TetrisGame extends LightningElement {

    renderedCallback() {
        try {
            console.log('INSIDE RENDERED CALLBACK ');

            //Main grid
            grid = this.template.querySelector(".grid");
            squares = Array.from(this.template.querySelectorAll(".grid div"));
            scoreDisplay = this.template.querySelector('[data-id="score"]');
            startButton = this.template.querySelector('[data-id="startbutton"]');

            //Mini grid
            displaySquares = this.template.querySelectorAll(".mini-grid div");

            //tetrisFunctions.randomTetromino();
            tetrisFunctions.drawTetromino();

            //Make Tetromino move down
            //timerId = setInterval(tetrisFunctions.moveDown, 1000);

            //Listen to keyup event
            document.addEventListener('keyup', (event) => {
                tetrisFunctions.keyControl(event);
            });

            //Listen to button click event
            startButton.addEventListener('click', (event) => {
                console.log(event);                
                if (timerId) {
                    clearInterval(timerId);
                    timerId = null;
                } else {
                    tetrisFunctions.drawTetromino();
                    timerId = setInterval(tetrisFunctions.moveDown, 1000);
                    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                    nextTetrominoObj.displayShape();
                }
            });

        } catch (error) {
            console.log('Error : ' + error);
        }
    }

    /*handleButtonClick(event){
        console.log('Button Event : ' + event);
        
        if (timerId) {
            //changeColor = 'brand';
            clearInterval(timerId);
            timerId = null;
        } else {
            //changeColor = 'destructive';
            tetrisFunctions.drawTetromino();
            timerId = setInterval(tetrisFunctions.moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            nextTetrominoObj.displayShape();
        }
    }*/

    /*toggleButtonColor(){
        if(this.changeColor === 'neutral'){
            this.changeColor = 'brand';
        } else if (this.changeColor === 'brand'){
            this.changeColor = 'destructive';
        } else if (this.changeColor === 'destructive'){  
            this.changeColor = 'brand';
        }     
    }*/

}

class TetrisFunctionality {

    keyControl(event) {

        if (event.keyCode === 37) {
            this.moveLeft();
        } else if (event.keyCode === 38) {
            //rotate
            this.rotate();
        } else if (event.keyCode === 39) {
            //moveRight
            this.moveRight();
        } else if (event.keyCode === 40) {
            //moveDown
            this.moveDown();
        }
    }

    drawTetromino() {
        try {
            //Draw
            currentTetromino.forEach(index => {
                squares[currentPosition + index].classList.add('tetromino');
                squares[currentPosition + index].style.backgroundColor = colors[random];
            });
        } catch (error) {
            console.log('Error drawTetromino : ' + error);
        }
    }

    undrawTetromino() {
        try {
            //Undraw
            currentTetromino.forEach(index => {
                squares[currentPosition + index].classList.remove('tetromino');
                squares[currentPosition + index].style.backgroundColor = '';
            });
        } catch (error) {
            console.log('Error undrawTetromino : ' + error);
        }
    }

    moveDown() {
        try {
            tetrisFunctions.undrawTetromino();
            currentPosition += width;
            tetrisFunctions.drawTetromino();
            tetrisFunctions.freeze();
        } catch (error) {
            console.log('Error moveDown : ' + error);
        }
    }

    freeze() {
        try {
            if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
                currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'));
                //start a new tetromino falling
                random = nextRandom;
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                currentTetromino = theTetrominoes[random][currentRotation];
                currentPosition = 4;
                this.drawTetromino();
                nextTetrominoObj.displayShape();
                this.addScore();
                this.gameOver();
            }
        } catch (error) {
            console.log('Error freeze : ' + error);
        }
    }

    //move the tetromino left, unless it is at the edge or a blockage
    moveLeft() {
        try {
            this.undrawTetromino();
            const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);

            if (!isAtLeftEdge) {
                currentPosition -= 1;
            }
            if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition += 1;
            }

            this.drawTetromino();
        } catch (error) {
            console.log('Error moveLeft : ' + error);
        }
    }

    //move the tetromino right, unless it is at the edge or a blockage
    moveRight() {
        try {
            this.undrawTetromino();
            const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);

            if (!isAtRightEdge) {
                currentPosition += 1;
            }
            if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition -= 1;
            }

            this.drawTetromino();
        } catch (error) {
            console.log('Error moveRight : ' + error);
        }
    }

    //rotate the tetromino
    rotate() {
        try {
            this.undrawTetromino();
            currentRotation++;
            if (currentRotation === currentTetromino.length) {//If currentRotation goes to 4, revert it to 0
                currentRotation = 0;
            }
            currentTetromino = theTetrominoes[random][currentRotation];
            this.drawTetromino();

        } catch (error) {
            console.log('Error rotate : ' + error);
        }
    }

    addScore() {
        try {
            for (let i = 0; i < 199; i += width) {
                const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

                if (row.every(index => squares[index].classList.contains('taken'))) {
                    score += 10;
                    scoreDisplay.innerHTML = score;
                    row.forEach(index => {
                        squares[index].classList.remove('taken');
                        squares[index].classList.remove('tetromino');
                        squares[index].style.backgroundColor = '';
                    });
                    const squaresRemoved = squares.splice(i, width);
                    squares = squaresRemoved.concat(squares);
                    squares.forEach(cell => grid.appendChild(cell));
                }
            }
        } catch (error) {
            console.log('Error addScore : ' + error);
        }
    }

    gameOver(){
        if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'GAME OVER';
            clearInterval(timerId);
        }
    }
}

class NextTetromino {

    //display shape in mini grid
    displayShape() {
        try {
            displaySquares.forEach(square => {
                square.classList.remove('tetromino');
                square.style.backgroundColor = '';
            });
            upNextTetrominoes[nextRandom].forEach(index => {
                displaySquares[displayIndex + index].classList.add('tetromino');
                displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
            });
        } catch (error) {
            console.log('Error displayShape : ' + error);
        }
    }

}