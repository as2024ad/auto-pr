import os
import subprocess

def insecure_function():
    user_input = input("Enter a command: ")
    # Vulnerability: Command Injection
    os.system(user_input)

def insecure_sql_query(user_id):
    # Vulnerability: SQL Injection
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    result = subprocess.run(["sqlite3", "database.db", query], capture_output=True)
    print(result.stdout)

if __name__ == "__main__":
    insecure_function()
    user_id = input("Enter user ID: ")
    insecure_sql_query(user_id)
