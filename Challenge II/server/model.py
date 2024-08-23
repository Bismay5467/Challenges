from flask import Flask, request, jsonify
import json
from rules import latest_financial_index, iscr_flag, total_revenue_5cr_flag, iscr, borrowing_to_revenue_flag
from flask_cors import CORS

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

CORS(app)

def probe_model_5l_profit(data: dict):
    """
    Evaluate various financial flags for the model.

    :param data: A dictionary containing financial data.
    :return: A dictionary with the evaluated flag values.
    """
    lastest_financial_index_value = latest_financial_index(data)

    total_revenue_5cr_flag_value = total_revenue_5cr_flag(
        data, lastest_financial_index_value
    )

    borrowing_to_revenue_flag_value = borrowing_to_revenue_flag(
        data, lastest_financial_index_value
    )

    iscr_flag_value = iscr_flag(data, lastest_financial_index_value)

    return {
        "flags": {
            "TOTAL_REVENUE_5CR_FLAG": total_revenue_5cr_flag_value,
            "BORROWING_TO_REVENUE_FLAG": borrowing_to_revenue_flag_value,
            "ISCR_FLAG": iscr_flag_value,
        }
    }

@app.route('/financial-flags', methods=['POST'])
def get_financial_flags():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        data = json.load(file)
        result = probe_model_5l_profit(data["data"])
        return jsonify(result), 200
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)