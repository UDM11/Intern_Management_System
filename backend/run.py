import uvicorn

if __name__ == "__main__":
    try:
        print("Starting Intern Management System Backend...")
        print("Server will be available at: http://localhost:8000")
        print("API Documentation: http://localhost:8000/docs")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)
        
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        input("Press Enter to exit...")
    except KeyboardInterrupt:
        print("\nServer stopped by user")