import uvicorn

# ---------------------------------------------------
# Server Entry Point
# ---------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",   # location of FastAPI app
        host="127.0.0.1", # localhost
        port=8000,        # server port
        reload=True       # auto-reload during development
    )   