from fastapi import FastAPI,Form, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Annotated
import sqlite3



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
    return '200'















# 정적 파일들을 서버에 올림
app.mount("/", StaticFiles(directory="frontEnd", html=True), name="frontEnd")