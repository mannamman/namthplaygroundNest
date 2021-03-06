# server
from flask import request, Flask, Response
from yfin_module import YFin
from log_module import Logger
import traceback
import json
from dotenv import load_dotenv
import os

load_dotenv()

host = os.getenv("FLASK_HOST")
port = int(os.getenv("FLASK_PORT"))

app = Flask(__name__)

yfin = YFin()
logger = Logger()

@app.post('/yfin')
def fun():
    global yfin
    global logger
    try:
        body = json.loads(request.get_data().decode("utf-8"))
        subject = body["subject"]
        start = body["start"]
        end = body["end"]
        close_prices, close_dates = yfin.get_real_stock(subject, start, end)
        return_msg = {
            "close_prices" : close_prices,
            "close_dates" : close_dates
        }
        return Response(response=json.dumps(return_msg), status=200)
    except Exception:
        error = traceback.format_exc()
        logger.error_log(error)
        return Response(response=json.dumps({'error':error}), status=400)

if(__name__ == "__main__"):
    logger.boot_log()
    app.run(host=host, port=port, debug=False)
    logger.term_log()
