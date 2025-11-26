#!/usr/bin/env python3
"""
Railway entry point - redirects to backend
"""
import sys
import os
sys.path.append('backend')
from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))