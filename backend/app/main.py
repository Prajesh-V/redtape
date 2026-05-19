# FILE: backend/app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.contract_routes import router as contract_router
from app.routes.notice_routes import router as notice_router
from app.routes.lawyer_routes import router as lawyer_router
from app.routes.chat_routes import router as chat_router

# ---------------------------------------------------
# FastAPI Application Initialization
# ---------------------------------------------------

app = FastAPI(
    title="RedTape API",
    description="Automated legal execution engine for Indian citizens",
    version="1.0.0"
)

# Configure CORS — reads FRONTEND_URL from env in production
_frontend_url = os.getenv("FRONTEND_URL", "")

# Always-allowed origins (dev + known production URLs)
_allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://redtape-exe.vercel.app",  # production Vercel URL
]

# Also support comma-separated list in FRONTEND_URL env var
for _url in _frontend_url.split(","):
    _url = _url.strip()
    if _url and _url not in _allowed_origins:
        _allowed_origins.append(_url)

print(f"[CORS] Allowed origins: {_allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# Root Health Check
# ---------------------------------------------------

@app.get("/")
def root():
    """
    Basic health check endpoint to verify backend status.
    """
    return {
        "service": "RedTape Backend",
        "status": "running"
    }

# ---------------------------------------------------
# Register API Routers
# ---------------------------------------------------

# Document scanning and analysis routes
app.include_router(contract_router)

# Legal notice generation routes
app.include_router(notice_router)

# Lawyer recommendation and matching routes
app.include_router(lawyer_router)

# Document chatbot routes
app.include_router(chat_router)