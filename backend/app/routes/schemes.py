import json
from typing import List, Optional
from fastapi import APIRouter, Query
from app.config import SCHEMES_FILE
from app.schemas import SchemeMatchRequest, SchemeMatchResponse, SchemeItem

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

def load_schemes():
    try:
        with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading schemes.json: {e}")
        return []

@router.get("", response_model=List[dict])
def get_all_schemes(category: Optional[str] = Query(None), search: Optional[str] = Query(None)):
    """Retrieve all available government schemes with optional search/category filter."""
    schemes = load_schemes()
    filtered = schemes
    
    if category and category.lower() != "all":
        filtered = [s for s in filtered if s.get("category", "").lower() == category.lower()]
        
    if search:
        s_lower = search.lower()
        filtered = [
            s for s in filtered
            if s_lower in s.get("name", "").lower() 
            or s_lower in s.get("description", "").lower()
            or s_lower in s.get("category", "").lower()
            or s_lower in s.get("target_audience", "").lower()
        ]
        
    return filtered

@router.post("/match", response_model=SchemeMatchResponse)
def match_schemes(req: SchemeMatchRequest):
    """
    Matches citizen profile against 25+ government schemes:
    Evaluates age, state, income, occupation, gender, and social category.
    Returns matched schemes sorted by suitability with eligibility reasons and application steps.
    """
    all_schemes = load_schemes()
    matched = []

    req_occupation_lower = req.occupation.lower()
    req_gender_lower = req.gender.lower()
    req_category_lower = req.category.lower()
    req_state_lower = req.state.lower()

    for scheme in all_schemes:
        score = 0
        reasons = []
        is_strictly_ineligible = False

        # 1. Age check
        min_age = scheme.get("min_age")
        max_age = scheme.get("max_age")
        if min_age is not None and req.age < min_age:
            is_strictly_ineligible = True
        elif max_age is not None and req.age > max_age:
            is_strictly_ineligible = True
        else:
            score += 20
            if min_age is not None and max_age is not None:
                reasons.append(f"Age {req.age} is within eligible bracket ({min_age}-{max_age} yrs)")
            elif min_age is not None:
                reasons.append(f"Age {req.age} meets minimum age requirement ({min_age}+ yrs)")
            else:
                reasons.append("Universal age eligibility")

        # 2. Gender check
        scheme_gender = scheme.get("gender", "All").lower()
        if scheme_gender != "all" and req_gender_lower != "all" and scheme_gender != req_gender_lower:
            is_strictly_ineligible = True
        elif scheme_gender == req_gender_lower and scheme_gender != "all":
            score += 25
            reasons.append(f"Specifically tailored for {scheme.get('gender')} applicants")
        else:
            score += 15
            reasons.append("Applicable across all genders")

        # 3. Income check
        max_income = scheme.get("max_income")
        if max_income is not None:
            if req.income > max_income:
                is_strictly_ineligible = True
            else:
                score += 20
                reasons.append(f"Annual income ₹{req.income:,.0f} falls within ceiling of ₹{max_income:,.0f}")
        else:
            score += 15
            reasons.append("No strict annual income cap")

        # 4. State check
        state_filter = [st.lower() for st in scheme.get("state_filter", ["all"])]
        if "all" not in state_filter and req_state_lower not in ["all", "any", ""] and req_state_lower not in state_filter:
            is_strictly_ineligible = True
        elif "all" not in state_filter and req_state_lower in state_filter:
            score += 20
            reasons.append(f"Special priority program for {req.state}")
        else:
            score += 10
            reasons.append("Pan-India Central Scheme")

        # 5. Occupation check
        scheme_occs = [occ.lower() for occ in scheme.get("occupation", ["all"])]
        if "all" in scheme_occs:
            score += 15
            reasons.append("Open for all occupations / informal sector")
        elif req_occupation_lower in scheme_occs or any(req_occupation_lower in occ for occ in scheme_occs):
            score += 25
            reasons.append(f"Directly matches your occupation: {req.occupation}")
        elif req_occupation_lower in ["any", "all", ""]:
            score += 10
        else:
            # Not strictly disqualifying unless occupation specific
            score -= 10

        # 6. Category check
        scheme_caste = [c.lower() for c in scheme.get("caste_category", ["all"])]
        if "all" in scheme_caste:
            score += 10
        elif req_category_lower in scheme_caste:
            score += 20
            reasons.append(f"Special allocation for {req.category} category beneficiaries")

        if not is_strictly_ineligible and score >= 40:
            final_score = min(max(score, 45), 100)
            matched.append(SchemeItem(
                id=scheme["id"],
                name=scheme["name"],
                name_hi=scheme.get("name_hi"),
                category=scheme["category"],
                ministry=scheme["ministry"],
                description=scheme["description"],
                benefits=scheme["benefits"],
                documents_required=scheme.get("documents_required", []),
                application_steps=scheme.get("application_steps", []),
                official_portal=scheme.get("official_portal", "https://myscheme.gov.in"),
                match_score=final_score,
                match_reasons=reasons
            ))

    # Sort matched schemes by match_score descending
    matched.sort(key=lambda x: x.match_score, reverse=True)

    return SchemeMatchResponse(
        user_profile={
            "age": req.age,
            "state": req.state,
            "income": req.income,
            "occupation": req.occupation,
            "gender": req.gender,
            "category": req.category
        },
        total_matched=len(matched),
        schemes=matched
    )
