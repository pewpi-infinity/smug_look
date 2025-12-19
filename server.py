from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/run', methods=['GET'])
def run_cart():
    cart_id = request.args.get('cart')
    filename = f"cart{cart_id}_*.py"
    matches = [f for f in os.listdir() if f.startswith(f"cart{cart_id}_") and f.endswith(".py")]
    if not matches:
        return jsonify({"error": "Cart not found"}), 404

    cart_file = matches[0]
    try:
        result = subprocess.check_output(['python', cart_file], stderr=subprocess.STDOUT, timeout=30)
        return jsonify({"output": result.decode()})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": e.output.decode()}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
