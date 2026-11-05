import os, secrets, sqlite3
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, flash, jsonify, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()
ROOT=Path(__file__).resolve().parent
INSTANCE=ROOT/"instance"; INSTANCE.mkdir(exist_ok=True)
DB=Path(os.getenv("DATABASE_PATH", INSTANCE/"portfolio.db"))
app=Flask(__name__)
app.config.update(SECRET_KEY=os.getenv("SECRET_KEY") or secrets.token_hex(32),
 SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax",
 SESSION_COOKIE_SECURE=os.getenv("COOKIE_SECURE","0")=="1", MAX_CONTENT_LENGTH=1024*1024)

def db():
 c=sqlite3.connect(DB); c.row_factory=sqlite3.Row; return c

def init_db():
 with db() as c:
  c.execute("CREATE TABLE IF NOT EXISTS admins(id INTEGER PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at TEXT NOT NULL)")
  c.execute("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,subject TEXT NOT NULL DEFAULT '',message TEXT NOT NULL,is_read INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL)")
  email=os.getenv("ADMIN_EMAIL","").strip().lower(); password=os.getenv("ADMIN_PASSWORD","")
  if email and password and not c.execute("SELECT id FROM admins WHERE email=?",(email,)).fetchone():
   c.execute("INSERT INTO admins(email,password_hash,created_at) VALUES(?,?,?)",(email,generate_password_hash(password),datetime.now(timezone.utc).isoformat()))

def csrf():
 if "_csrf" not in session: session["_csrf"]=secrets.token_urlsafe(32)
 return session["_csrf"]
@app.context_processor
def inject(): return {"csrf_token":csrf()}
def valid_csrf():
 sent=request.form.get("csrf_token") or request.headers.get("X-CSRF-Token")
 expected=session.get("_csrf")
 return bool(sent and expected and secrets.compare_digest(sent,expected))
def admin_only(fn):
 @wraps(fn)
 def wrapped(*a,**kw):
  if not session.get("admin_id"): return redirect(url_for("admin_login",next=request.path))
  return fn(*a,**kw)
 return wrapped
@app.after_request
def headers(r):
 r.headers["X-Content-Type-Options"]="nosniff"; r.headers["X-Frame-Options"]="SAMEORIGIN"
 r.headers["Referrer-Policy"]="strict-origin-when-cross-origin"
 return r
@app.get("/")
def home(): return render_template("index.html")
@app.post("/contact")
def contact():
 ajax=request.headers.get("X-Requested-With")=="XMLHttpRequest"
 if not valid_csrf():
  msg="Your session expired. Refresh the page and try again."
  if ajax:return jsonify(error=msg),400
  flash(msg,"error");return redirect(url_for("home")+"#contact")
 name=request.form.get("name","").strip(); email=request.form.get("email","").strip().lower()
 subject=request.form.get("subject","").strip(); message=request.form.get("message","").strip()
 error=None
 if not name or len(name)>80 or not email or len(email)>120 or "@" not in email:error="Enter a valid name and email address."
 elif len(subject)>140 or len(message)<10 or len(message)>5000:error="Message must be between 10 and 5,000 characters."
 if error:
  if ajax:return jsonify(error=error),400
  flash(error,"error");return redirect(url_for("home")+"#contact")
 with db() as c:c.execute("INSERT INTO messages(name,email,subject,message,created_at) VALUES(?,?,?,?,?)",(name,email,subject,message,datetime.now(timezone.utc).isoformat()))
 if ajax:return jsonify(message="Thank you. Your message has been sent.")
 flash("Thank you. Your message has been sent.","success");return redirect(url_for("home")+"#contact")
@app.route("/admin/login",methods=["GET","POST"])
def admin_login():
 if session.get("admin_id"):return redirect(url_for("admin_dashboard"))
 if request.method=="POST":
  if not valid_csrf():flash("Session expired. Please try again.","error");return redirect(url_for("admin_login"))
  email=request.form.get("email","").strip().lower(); password=request.form.get("password","")
  with db() as c:admin=c.execute("SELECT * FROM admins WHERE email=?",(email,)).fetchone()
  if admin and check_password_hash(admin["password_hash"],password):
   session.clear();session["admin_id"]=admin["id"];session["admin_email"]=admin["email"]
   return redirect(url_for("admin_dashboard"))
  flash("Invalid email or password.","error")
 return render_template("admin_login.html")
@app.get("/admin")
@admin_only
def admin_dashboard():
 with db() as c:
  items=c.execute("SELECT * FROM messages ORDER BY id DESC").fetchall()
  unread=c.execute("SELECT COUNT(*) FROM messages WHERE is_read=0").fetchone()[0]
 return render_template("admin_dashboard.html",messages=items,unread_count=unread)
@app.post("/admin/message/<int:mid>/read")
@admin_only
def mark_read(mid):
 if not valid_csrf():flash("Session expired. Try again.","error")
 else:
  with db() as c:c.execute("UPDATE messages SET is_read=1 WHERE id=?",(mid,))
 return redirect(url_for("admin_dashboard"))
@app.post("/admin/message/<int:mid>/delete")
@admin_only
def delete_message(mid):
 if not valid_csrf():flash("Session expired. Try again.","error")
 else:
  with db() as c:c.execute("DELETE FROM messages WHERE id=?",(mid,))
  flash("Message deleted.","success")
 return redirect(url_for("admin_dashboard"))
@app.post("/admin/logout")
@admin_only
def logout():
 if valid_csrf():session.clear()
 return redirect(url_for("admin_login"))
@app.get("/health")
def health():return jsonify(status="ok",app="Code Titan Portfolio")
init_db()
if __name__=="__main__":app.run(debug=os.getenv("FLASK_DEBUG","0")=="1")
