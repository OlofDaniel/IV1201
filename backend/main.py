import time

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

stored_message: str = "Unaltered backend message"


class MessageRequest(BaseModel):
    message: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/testing")
def test():
    time.sleep(2)
    return {"message": stored_message}


@app.post("/testing")
def post_message(payload: MessageRequest):
    time.sleep(1)
    global stored_message
    stored_message = payload.message
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
