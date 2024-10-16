const boardSize = 8;
const words = ["APPLE", "CHERRY", "DATE", "FIG", "GRAPE", "KIWI", "BANANA"];
//보드판 데이터 배열 생성
const board = Array.from({ length: boardSize }, () =>
  Array(boardSize).fill("")
);

//배열에 단어 뿌리기
function placeWord(word) {
  const direction = Math.floor(Math.random() * 2); // 0: 가로, 1: 세로
  const row = Math.floor(Math.random() * boardSize); //몇번 줄부터 시작할지
  const col = Math.floor(Math.random() * boardSize); //몇번칸부터 시작할지

  if (direction === 0) {
    // 가로
    if (col + word.length <= boardSize) {
      //글자수가 판을 넘는지 체크
      for (let i = 0; i < word.length; i++) {
        if (board[row][col + i] !== "") {
          if (board[row][col + i] !== word[i]) {
            return false; // 충돌 체크
          }
        }
      }
      for (let i = 0; i < word.length; i++) {
        board[row][col + i] = word[i]; //배열에 단어 넣어준다.
      }
      return true;
    }
  } else {
    // 세로
    if (row + word.length <= boardSize) {
      for (let i = 0; i < word.length; i++) {
        if (board[row + i][col] !== "") {
          if (board[row + i][col] !== word[i]) {
            return false;
          }
        }
      }
      for (let i = 0; i < word.length; i++) {
        board[row + i][col] = word[i]; //배열에 단어 넣어준다.
      }
      return true;
    }
  }
  return false;
}

//빈칸 채우기- 알파벳 무작위
function fillEmptyCells() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === "") {
        board[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
      }
    }
  }
}

function createBoard() {
  words.forEach((word) => {
    let placed = false;
    while (!placed) {
      placed = placeWord(word);
    }
  });
  fillEmptyCells();
  renderBoard();
}

//판 요소로 만들어서 보여주기
function renderBoard() {
  const boardElement = document.getElementById("gameBoard");
  board.forEach((row) => {
    row.forEach((cell) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;
      boardElement.appendChild(cellElement);
    });
  });
}

createBoard();
