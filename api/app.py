from flask import Flask, jsonify, request, session
from flask_mysqldb import MySQL
import os
import datetime
import uuid 

app = Flask(__name__)
app.secret_key = os.urandom(24)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'flaskreact'

mysql = MySQL(app)

def generate_session_id():
    return str(uuid.uuid4())

@app.route('/logout', methods=['GET'])
def logout():
    session.pop('logged_in', None)
    session.pop('session_id', None)
    return jsonify({'success': True, 'message': 'Logged out successfully'})



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM admin WHERE username = %s AND password = %s', (username, password))
    user = cursor.fetchone()

    if user:
        session['logged_in'] = True
        session_id = session.get('session_id')
        if session_id is None:
            session_id = generate_session_id()
            session['session_id'] = session_id

        ip_address = request.remote_addr
        last_date = datetime.datetime.now()

        user_id = user[0]
        
        # Kullanıcı tabloda var mı kontrol et
        cursor.execute('SELECT * FROM logs WHERE userid = %s', (user_id,))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.execute('UPDATE logs SET session_id = %s, ip_adress = %s, last_date = %s WHERE userid = %s',
                           (session_id, ip_address, last_date, user_id))
        else:
            cursor.execute('INSERT INTO logs (userid, session_id, ip_adress, last_date) VALUES (%s, %s, %s, %s)',
                           (user_id, session_id, ip_address, last_date))
        
        mysql.connection.commit()
        cursor.close()
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}),401


if __name__ == '__main__':
    app.run(debug=True)
