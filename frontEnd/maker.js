const gameMakerForm = document.getElementById("gameMaker-form");

//단어 조건 체크 wordCheck(word)===============================
const wordCheck = (word) => {
  let wordList = [];
  let wrongCnt = 0;

  //단어 등록한 것 하나씩 조건 비교하기
  for (let i = 0; i < word.length; i++) {
    const inputVal = word[i].value;
    const msgSpan = word[i].nextElementSibling;

    //글자 수 체크
    if (inputVal.length > 15) {
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
      if (inputVal != "") wordList.push(word[i].value);
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
  console.log(wordList);
  if (wordList) {
    console.log("true wordList : ", wordList);

    const body = new FormData(gameMakerForm);
    body.append("createAt", new Date().getTime());
    body.append("wordList", wordList);

    try {
      const res = await fetch("/makeGame", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data === "200") window.location.pathname = "/game.html";
    } catch (e) {
      console.error(e);
    }
  } else {
    alert("문제가 있습니다.");
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

//input30개 뿌리기 ===============================
const inputRender = () => {
  const wordListEl = document.querySelector(".wordlist");
  for (let i = 0; i < 30; i++) {
    const wordListDiv = document.createElement("div");
    wordListDiv.className = "wordList-div";
    const input = document.createElement("input");
    input.type = "text";
    input.name = "word";

    const wordMsg = document.createElement("span");
    wordMsg.className = "word-msg";

    wordListDiv.appendChild(input);
    wordListDiv.appendChild(wordMsg);
    wordListEl.appendChild(wordListDiv);
  }
};

inputRender();
