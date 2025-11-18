import sqlite3

def view_database():
    conn = sqlite3.connect('intern_management.db')
    cursor = conn.cursor()
    
    # Get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print("=== DATABASE TABLES ===")
    for table in tables:
        print(f"- {table[0]}")
    
    print("\n=== TABLE DATA ===")
    for table in tables:
        table_name = table[0]
        print(f"\n--- {table_name.upper()} ---")
        
        try:
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            
            if rows:
                # Get column names
                cursor.execute(f"PRAGMA table_info({table_name})")
                columns = [col[1] for col in cursor.fetchall()]
                
                # Print header
                print(" | ".join(columns))
                print("-" * (len(" | ".join(columns))))
                
                # Print rows
                for row in rows:
                    print(" | ".join(str(cell) for cell in row))
            else:
                print("No data found")
        except Exception as e:
            print(f"Error reading table: {e}")
    
    conn.close()

if __name__ == "__main__":
    view_database()