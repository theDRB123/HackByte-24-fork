from flask import Flask
import datetime
from flask_cors import CORS
 
x = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
CORS(app) 
 
 
# Route for seeing a data
@app.route('/data')
def get_time():
 
    # Returning an api for showing in  reactjs
    return {
        'Name':"geek", 
        "Age":"22",
        "Date":x, 
        "programming":"python"
        }
 
     
# Running app
if __name__ == '__main__':
    app.run(debug=True)