document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const Xyz = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;

  //the tetrominoes
  const lTetromino = [
    [1, Xyz + 1, Xyz * 2 + 1, 2],
    [Xyz, Xyz + 1, Xyz + 2, Xyz * 2 + 2],
    [1, Xyz + 1, Xyz * 2 + 1, Xyz * 2],
    [Xyz, Xyz * 2, Xyz * 2 + 1, Xyz * 2 + 2],
  ];

  const zTetromino = [
    [0, Xyz, Xyz + 1, Xyz * 2 + 1],
    [Xyz + 1, Xyz + 2, Xyz * 2, Xyz * 2 + 1],
    [0, Xyz, Xyz + 1, Xyz * 2 + 1],
    [Xyz + 1, Xyz + 2, Xyz * 2, Xyz * 2 + 1],
  ];

  const tTetromino = [
    [1, Xyz, Xyz + 1, Xyz + 2],
    [1, Xyz + 1, Xyz + 2, Xyz * 2 + 1],
    [Xyz, Xyz + 1, Xyz + 2, Xyz * 2 + 1],
    [1, Xyz, Xyz + 1, Xyz * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, Xyz, Xyz + 1],
    [0, 1, Xyz, Xyz + 1],
    [0, 1, Xyz, Xyz + 1],
    [0, 1, Xyz, Xyz + 1],
  ];

  const iTetromino = [
    [1, Xyz + 1, Xyz * 2 + 1, Xyz * 3 + 1],
    [Xyz, Xyz + 1, Xyz + 2, Xyz + 3],
    [1, Xyz + 1, Xyz * 2 + 1, Xyz * 3 + 1],
    [Xyz, Xyz + 1, Xyz + 2, Xyz + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let currentPosition = 4;
  let currentRotation = 0;

  console.log(theTetrominoes[0][0]);

  //randomly select a tetromino and it's first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draws the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  }
  //undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //make the tetromino move down every second
  //timerId = setInterval(moveDown, 1000);

  //assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);
  //move down function
  function moveDown() {
    undraw();
    currentPosition += Xyz;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + Xyz].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unless it is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % Xyz === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % Xyz === Xyz - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  //show up-next tetromino in minigrid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayXyz = 4;
  const displayIndex = 0;
  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayXyz + 1, displayXyz * 2 + 1, 2], //lTetromino
    [0, displayXyz, displayXyz + 1, displayXyz * 2 + 1], //zTetromino
    [1, displayXyz, displayXyz + 1, displayXyz + 2], //tTetromino
    [0, 1, displayXyz, displayXyz + 1], //oTetromino
    [1, displayXyz + 1, displayXyz * 2 + 1, displayXyz * 3 + 1], //iTetromino
  ];

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
    });
  }

  //add functionality to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += Xyz) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
        });
        const squaresRemoved = squares.splice(i, Xyz);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
