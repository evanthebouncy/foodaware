from flask import Flask,redirect, url_for,render_template,g

app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/') 
def GoHome(): return render_template('home.html')
#def Test(): return 'Test'

if __name__ == '__main__': 
    app.run()
                          