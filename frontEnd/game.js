const boardSize = 16;
const words = [];
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

const renderWordList = (wordlistData) => {
  wordlistData.forEach((obj) => {
    words.push(obj.word);
  });
  console.log(words);
  createBoard(); //보드생성

  //단어리스트ul 생성
  const wordListUl = document.querySelector(".wordList-ul");
  words.forEach((word) => {
    const li = document.createElement("li");
    li.className = "word";
    li.innerText = word;
    wordListUl.appendChild(li);
  });
};

//게임 단어 12개 이하로 줄이기
const randomWordList = (row) => {
  const indices = new Set();
  let rows = [];
  while (indices.size < 12) {
    const randomIndex = Math.floor(Math.random() * row.length);
    indices.add(randomIndex);
  }

  indices.forEach((idx) => {
    rows.push(row[idx]);
  });
  // console.log(rows); //선택된 단어들
  return rows;
};

//게임 정보 렌더링
const renderInfo = (data) => {
  // console.log(data);

  const gameInfo = data.gameInfo;
  const title = gameInfo.title;
  const description = gameInfo.description;

  const titleEl = document.querySelector(".title");
  titleEl.innerText = title;
  const descriptionEl = document.querySelector(".description");
  descriptionEl.innerText = description;

  let wordlistData = data.rows;
  if (wordlistData.length > 12) {
    wordlistData = randomWordList(wordlistData);
  }

  renderWordList(wordlistData);
};

// 현재 URL에서 gameIdx 값을 추출하는 함수
function getGameIdxFromUrl() {
  const pathParts = window.location.pathname.split("/");
  const gameIdx = pathParts[pathParts.length - 1]; // 마지막 부분이 gameIdx
  return gameIdx;
}

//데이터 불러오기
const fetchList = async () => {
  //console.log("gIdx : ",gIdx); // html에서 넘긴 gIdx 값 확인
  // URL에서 gameIdx 가져오기
  const gameIdx = getGameIdxFromUrl();
  console.log("현재 게임 인덱스:", gameIdx);

  const res = await fetch(`/getGame/${gameIdx}`);
  const data = await res.json();
  //console.log("data.rows.length : ", data.rows.length);

  renderInfo(data);
};

fetchList();
