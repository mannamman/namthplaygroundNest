# server
from flask import request, Flask, Response
from yfin_module import YFin
import traceback
import json

app = Flask(__name__)

yfin = YFin()

@app.post('/yfin')
def fun():
    global yfin
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
        print(error)
        return Response(response=json.dumps({'error':error}), status=400)

if(__name__ == "__main__"):
    app.run(host="127.0.0.1", port=3020, debug=False)
