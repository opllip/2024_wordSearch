from fastapi import FastAPI,Form, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.encoders import jsonable_encoder
from typing import Annotated
import sqlite3
from pydantic import BaseModel




con = sqlite3.connect('wordSearch.db', check_same_thread=False)
cur = con.cursor()

# 테이블이 없으면 생성한다.
cur.execute(f"""
    CREATE TABLE IF NOT EXISTS gameInfo (
	idx INTEGER PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	wordList TEXT,
	createAt INTEGER NOT NULL
	);
            """)
cur.execute(f"""
    CREATE TABLE IF NOT EXISTS gameWord (
	idx INTEGER PRIMARY KEY,
	gameInfo_idx INTEGER NOT NULL,
	word TEXT ,
	FOREIGN KEY (gameInfo_idx) REFERENCES gameInfo(idx)
	);
            """)



app = FastAPI()



# 게임저장하기
@app.post('/makeGame')
async def create_game(
                title:Annotated[str,Form()],  
                description:Annotated[str,Form()], 
                createAt:Annotated[int,Form()],
                wordList:Annotated[str,Form()],
                ):

    # 게임정보 저장
    cur.execute(f"""
                INSERT INTO gameInfo 
                (title ,description, wordList, createAt) 
                VALUES 
                ('{title}', '{description}','{wordList}', {createAt})
                """)
    
    
    # 게임정보의 idx 가져오기
    gameIdx = cur.execute(f"""
                       SELECT idx FROM gameInfo
                       WHERE createAt = {createAt} and title='{title}'
                       """).fetchone()[0] 
    
    # print("gameIdx : ", gameIdx)
    
    wordListArray = wordList.split(",")
    for word in wordListArray:
        # print(word)
        # 단어 저장하기
        cur.execute(f"""
                INSERT INTO gameWord
                (gameInfo_idx ,word) 
                VALUES 
                ({gameIdx} , '{word}')
                """)
    con.commit()
    return gameIdx

# 게임페이지 이동
@app.get("/games/{gameIdx}", response_class=HTMLResponse)
async def game_page(gameIdx):
    with open("frontEnd/game.html", encoding='utf-8' ) as f:
        content = f.read().replace("{{ gameIdx }}", str(gameIdx))
    return HTMLResponse(content=content)


# 아이템 불러오기
@app.get("/getGame/{gameIdx}")
async def get_game(gameIdx):
    con.row_factory = sqlite3.Row
    #  ㄴ 컬럼명도 같이 가져오는 문법
    cur = con.cursor() 
    # 게임정보의 idx 가져오기
    gameInfo = cur.execute(f"""
                       SELECT * FROM gameInfo
                       WHERE  idx= {gameIdx}
                       """).fetchone()
    rows = cur.execute(f"""
                       SELECT idx, word FROM gameWord
                       WHERE gameInfo_idx= {gameIdx}
                       """).fetchall()
    
    gameSet = {"gameInfo": gameInfo, "rows": rows }
    return JSONResponse( jsonable_encoder(gameSet))
  
  












# 정적 파일들을 서버에 올림
app.mount("/", StaticFiles(directory="frontEnd", html=True), name="frontEnd")