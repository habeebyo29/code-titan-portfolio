# Code Titan Portfolio

Flask portfolio for Yusuf Habeeb, with SQLite contact-message storage and a protected admin inbox.

## Run on Windows PowerShell
```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
Copy `.env.example` to `.env`. Set a long random `SECRET_KEY`, your `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD`. Do not commit `.env` or share the password.

Then run:
```powershell
python app.py
```
Portfolio: http://127.0.0.1:5000  
Admin login: http://127.0.0.1:5000/admin/login

The first startup creates the admin account from the environment variables if it does not exist. Passwords are stored as hashes.

## Deployment
Start command: `gunicorn app:app`. Set `SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `COOKIE_SECURE=1` in host environment variables. Set `DATABASE_PATH` to a location on a persistent disk. Without persistent storage, SQLite messages can be lost on redeploy/restart. Use HTTPS.
