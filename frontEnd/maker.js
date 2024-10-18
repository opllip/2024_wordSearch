const gameMakerForm = document.getElementById("gameMaker-form");

//단어 조건 체크 wordCheck(word)===============================
const wordCheck = (word) => {
  let wordList = [];
  let wrongCnt = 0;

  //단어 등록한 것 하나씩 조건 비교하기
  for (let i = 0; i < word.length; i++) {
    const inputVal = word[i].value.trim();
    const msgSpan = word[i].nextElementSibling;
    const regex = /^[A-Za-z\s-]+$/;
    const isValid = regex.test(inputVal);

    if (!isValid && inputVal.length > 0) {
      msgSpan.innerText = "영문, 2개이하의 공백과 -만 사용할 수 있습니다.";
      msgSpan.classList.add("block");
      wrongCnt++;
    } else if (inputVal.length < 3) {
      //글자 수 체크
      msgSpan.innerText = "2자 이상 입력해주세요.";
      msgSpan.classList.add("block");
      wrongCnt++;
    } else if (inputVal.length > 15) {
      //글자 수 체크
      msgSpan.innerText = "14자 이하로 입력해주세요.";
      msgSpan.classList.add("block");
      wrongCnt++;
      //return false;
    } else if (wordList.includes(inputVal)) {
      //이미 리스트에 있는 경우
      msgSpan.innerText = "중복되는 단어입니다.";
      msgSpan.classList.add("block");
      wrongCnt++;
      //return false;
    } else {
      msgSpan.innerText = "";
      msgSpan.classList.remove("block");
      if (inputVal != "") wordList.push(inputVal.toUpperCase());
    }
  }

  //단어 갯수 10개 이하 체크
  const wordListMsg = document.querySelector(".wordlist-msg");
  if (wordList.length < 10) {
    wordListMsg.innerText = "단어를 10개 이상 입력해주세요.";
    wordListMsg.classList.add("block");
    wrongCnt++;
    //return false;
  } else {
    wordListMsg.innerText = "";
    wordListMsg.classList.remove("block");
  }

  if (wrongCnt === 0) return wordList;
  else return false;
};
//단어 조건 체크 wordCheck(word)=============================== end

//form 전송 핸들러 ===============================
const handleSubmitForm = async (event) => {
  event.preventDefault();

  const title = gameMakerForm.title.value;
  const description = gameMakerForm.description.value;
  const word = gameMakerForm.word;

  //let wordList = [];
  let wordList = await wordCheck(word);

  if (wordList) {
    //console.log("true wordList : ", wordList);

    const body = new FormData(gameMakerForm);
    body.append("createAt", new Date().getTime());
    body.append("wordList", wordList);

    try {
      const res = await fetch("/makeGame", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data === "200") {
        console.log("게임이 저장되었습니다.");
        //window.location.pathname = "/game.html";
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log("wordList 전송에 문제가 있습니다.");
    return false;
  }
};
gameMakerForm.addEventListener("submit", handleSubmitForm);
//form 전송 핸들러 =============================== end

//돌아가기 버튼 이벤트 ===============================
const backBtn = document.querySelector(".back-btn");
const handlerGoHome = () => {
  window.location.pathname = "game.html";
};
backBtn.addEventListener("click", handlerGoHome);

//input keypress 이벤트 ===============================
const validationInput = (event) => {
  const code = event.code;
  //console.log("code : ", code);

  // Backspace와 Tab 키는 허용
  if (code === "Backspace" || code === "Tab") {
    return; // 아무것도 하지 않음
  }

  if (code === "Minus" || code === "Space") {
    const currentValue = event.target.value;
    const spaceCnt = (currentValue.match(/ /g) || []).length; // 공백 개수
    const minusCnt = (currentValue.match(/-/g) || []).length; // 대시 개수
    const count = minusCnt + spaceCnt;
    //console.log("count : ", count);

    if (count > 1) {
      event.preventDefault(); // 기본 입력 방지
      //console.log(code === "Space" ? " " : "-", " 입력방지");
    }
    return; // 종료
  }
};

//input30개 뿌리기 ===============================
const inputRender = () => {
  const wordListEl = document.querySelector(".wordlist");
  for (let i = 0; i < 30; i++) {
    const wordListDiv = document.createElement("div");
    wordListDiv.className = "wordList-div";
    const input = document.createElement("input");
    input.type = "text";
    input.name = "word";
    input.addEventListener("keypress", validationInput);

    const wordMsg = document.createElement("span");
    wordMsg.className = "word-msg";

    wordListDiv.appendChild(input);
    wordListDiv.appendChild(wordMsg);
    wordListEl.appendChild(wordListDiv);
  }
};

inputRender();
