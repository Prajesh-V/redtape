# FILE: backend/app/schemas.py
from pydantic import BaseModel
from typing import Any, Optional, List

class APIResponse(BaseModel):
    """Standardized API response structure for all endpoints."""
    status: str
    data: Optional[Any] = None
    error: Optional[str] = None
    metadata: Optional[dict] = None

class NoticeRequest(BaseModel):
    """Request schema for generating a new legal notice."""
    issue: str
    # context_data allows passing analyzed contract results (summary/risks)
    # to provide the LLM with factual background for the notice.
    context_data: Optional[str] = None

class NoticeUpdateRequest(BaseModel):
    """Request schema for updating an existing notice draft."""
    notice_data: dict

class NoticeDownloadRequest(BaseModel):
    """Request schema for PDF generation."""
    notice_data: dict

class LawyerMatchRequest(BaseModel):
    """Request schema for finding specialized legal professionals."""
    issue_type: str
    location: Optional[str] = None