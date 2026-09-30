from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import sys
from werkzeug.serving import run_simple

app = Flask(__name__)
CORS(app)

# Backend service URLs
SERVICES = {
    'medicine': 'http://localhost:5001',
    'skin-disease': 'http://localhost:5002', 
    'health-records': 'http://localhost:3002',
    'chat': 'http://localhost:5050'
}

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "service": "Unified Healthcare Backend",
        "version": "1.0.0",
        "timestamp": "2025-09-21T10:30:00Z"
    })

@app.route('/api/<service>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy_request(service, path):
    """Proxy requests to appropriate backend service"""
    if service not in SERVICES:
        return jsonify({"error": f"Service '{service}' not found"}), 404
    
    target_url = f"{SERVICES[service]}/{path}"
    headers = dict(request.headers)
    
    # Remove host header to avoid conflicts
    headers.pop('Host', None)
    
    try:
        # Handle different HTTP methods
        if request.method == 'GET':
            response = requests.get(target_url, params=request.args, headers=headers, timeout=30)
        elif request.method == 'POST':
            if request.is_json:
                response = requests.post(target_url, json=request.get_json(), headers=headers, timeout=30)
            else:
                # Handle file uploads
                files = request.files
                data = request.form
                response = requests.post(target_url, files=files, data=data, headers=headers, timeout=30)
        elif request.method == 'PUT':
            response = requests.put(target_url, json=request.get_json(), headers=headers, timeout=30)
        elif request.method == 'DELETE':
            response = requests.delete(target_url, headers=headers, timeout=30)
        else:
            return jsonify({"error": f"Method {request.method} not supported"}), 405
        
        # Return the response
        try:
            return response.json(), response.status_code
        except ValueError:
            # If response is not JSON, return as text
            return response.text, response.status_code
            
    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": f"Cannot connect to {service} service at {SERVICES[service]}",
            "service": service,
            "status": "unavailable"
        }), 503
    except requests.exceptions.Timeout:
        return jsonify({
            "error": f"Timeout connecting to {service} service",
            "service": service
        }), 504
    except Exception as e:
        return jsonify({
            "error": f"Error proxying request to {service}: {str(e)}",
            "service": service
        }), 500

@app.route('/api/<service>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy_service_root(service):
    """Handle requests to service root (without additional path)"""
    return proxy_request(service, '')

@app.route('/')
def index():
    return jsonify({
        "message": "Unified Healthcare Backend API",
        "version": "1.0.0",
        "services": list(SERVICES.keys()),
        "endpoints": {
            "health": "/health",
            "medicine_api": "/api/medicine/*",
            "skin_disease_api": "/api/skin-disease/*",
            "health_records_api": "/api/health-records/*",
            "chat_api": "/api/chat/*"
        }
    })

if __name__ == '__main__':
    print("🏥 Starting Unified Healthcare Backend...")
    print("=" * 50)
    print(f"🌐 Server: http://localhost:8000")
    print(f"📊 Health Check: http://localhost:8000/health")
    print("")
    print("📡 Proxying requests to:")
    for service, url in SERVICES.items():
        print(f"   • {service.title().replace('-', ' ')}: {url}")
    print("")
    print("🔌 API Endpoints:")
    print("   • Medicine API: http://localhost:8000/api/medicine/*")
    print("   • Skin Disease API: http://localhost:8000/api/skin-disease/*")
    print("   • Health Records API: http://localhost:8000/api/health-records/*")
    print("   • Chat API: http://localhost:8000/api/chat/*")
    print("")
    print("✅ Ready to serve requests!")
    print("=" * 50)
    
    run_simple('0.0.0.0', 8000, app, use_reloader=True, use_debugger=True)
