# FILE: backend/app/routes/chat_routes.py
from fastapi import APIRouter
from pydantic import BaseModel
from app.schemas import APIResponse
from app.services.llm_service import chat_with_document

router = APIRouter(prefix="/chat", tags=["Document Chatbot"])

class ChatRequest(BaseModel):
    """Schema for incoming chatbot questions."""
    question: str
    document_context: str

@router.post("/ask", response_model=APIResponse)
async def ask_question(req: ChatRequest):
    """
    Processes a user's question about their specific document.
    Strictly uses the provided document_context to prevent hallucinations.
    """
    try:
        # 1. Input Validation
        if not req.question.strip():
            return APIResponse(
                status="error", 
                error="Question cannot be empty."
            )
            
        if not req.document_context.strip():
            return APIResponse(
                status="error", 
                error="Document context is required to answer accurately."
            )
            
        # 2. Call the RAG-style LLM function
        answer = chat_with_document(
            question=req.question,
            document_context=req.document_context
        )
        
        # 3. Return Standardized Response
        return APIResponse(
            status="success",
            data={"answer": answer}
        )
        
    except Exception as e:
        return APIResponse(
            status="error",
            error=f"Chat processing failed: {str(e)}"
        )