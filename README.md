**Monastery360**
- **Description**: A web app showcasing monastery and travel information for Sikkim.

**Demo**: https://www.youtube.com/watch?v=EHAq3YKuGMo

**Quick Start**
- **Backend**: Install Python dependencies and run the FastAPI server:
	- `python -m venv .venv`
	- `pip install -r backend/requirements.txt`
	- `uvicorn backend.gemini:app --reload --port 8000`
- **Frontend**: From `frontend/` install and run:
	- `pnpm install`
	- `pnpm dev`

**Environment**
- **Required**: `GEMINI_API_KEY` (the Google Gemini API key) set in `backend/.env` or the environment.




