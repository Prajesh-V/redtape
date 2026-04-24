from fastapi import FastAPI
from app.routes.contract_routes import router as contract_router
from app.routes.notice_routes import router as notice_router
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------
# FastAPI Application Initialization
# ---------------------------------------------------

app = FastAPI(
    title="RedTape API",
    description="Automated legal execution engine for Indian citizens",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------------------------
# Root Health Check
# ---------------------------------------------------

@app.get("/")
def root():
    return {
        "service": "RedTape Backend",
        "status": "running"
    }

# ---------------------------------------------------
# Register API Routers
# ---------------------------------------------------

app.include_router(contract_router)
app.include_router(notice_router)