# FILE: backend/app/routes/lawyer_routes.py
from fastapi import APIRouter, HTTPException
from app.schemas import APIResponse, LawyerMatchRequest
from app.services.lawyer_registry import lawyer_service

router = APIRouter(prefix="/lawyers", tags=["Lawyer Recommendations"])

@router.post("/recommend", response_model=APIResponse)
async def recommend_lawyers(req: LawyerMatchRequest):
    """
    Recommends verified lawyers based on the issue type and user location.
    """
    try:
        # Match lawyers using the dedicated registry service
        matches = lawyer_service.match_lawyers(
            issue_type_val=req.issue_type,
            location=req.location
        )
        
        if not matches:
            return APIResponse(
                status="success",
                data=[],
                metadata={"message": "No specific matches found for this issue type."}
            )
            
        return APIResponse(
            status="success",
            data=matches,
            metadata={"count": len(matches)}
        )
        
    except Exception as e:
        return APIResponse(
            status="error",
            error=f"Failed to fetch recommendations: {str(e)}"
        )

@router.get("/profile/{lawyer_id}", response_model=APIResponse)
async def get_lawyer_profile(lawyer_id: str):
    """
    Fetches detailed information for a specific lawyer profile.
    """
    lawyer = next((l for l in lawyer_service.lawyers if l.get("id") == lawyer_id), None)
    
    if not lawyer:
        return APIResponse(status="error", error="Lawyer profile not found")
        
    return APIResponse(status="success", data=lawyer)