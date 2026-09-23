from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import requests
import json
from datetime import datetime
import os
from config import config

app = Flask(__name__)
app.config.from_object(config[os.environ.get('FLASK_ENV', 'default')])
DB = app.config['DATABASE_URL']

# Enable CORS for all routes
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'])

# Helper function for database queries
def query_db(query, args=(), one=False):
    """Execute a database query and return results"""
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute(query, args)
    rv = c.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

# Initialize database if it doesn't exist
def init_db():
    """Initialize the database with schema and sample data"""
    if not os.path.exists(DB):
        with open('schema.sql', 'r') as f:
            schema = f.read()
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.executescript(schema)
        conn.commit()
        conn.close()
        print("Database initialized with sample data")

# Routes
@app.route("/")
def index():
    """Home page - redirect to user dashboard"""
    return render_template('user_dashboard.html')

@app.route("/health")
def health_check():
    """Health check endpoint for API monitoring"""
    return jsonify({
        "success": True,
        "message": "Nabha Medicine Availability Tracker API is running",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route("/pharmacy")
def pharmacy_dashboard():
    """Pharmacy dashboard page"""
    return render_template('pharmacy_dashboard.html')

@app.route("/api/search")
def search_medicine():
    """Search for medicine availability and information"""
    medicine = request.args.get("medicine", "").strip()
    
    if not medicine:
        return jsonify({"error": "Medicine name is required"}), 400
    
    # Get stock information from local database
    stock_rows = query_db(
        """SELECT pharmacies.name, pharmacies.location, pharmacies.latitude, 
           pharmacies.longitude, pharmacies.phone, stock.quantity, stock.last_updated
           FROM stock 
           JOIN pharmacies ON stock.pharmacy_id = pharmacies.id 
           WHERE LOWER(stock.medicine_name) LIKE LOWER(?) 
           AND stock.quantity > 0
           ORDER BY stock.quantity DESC""", 
        (f'%{medicine}%',)
    )
    
    availability = []
    for row in stock_rows:
        availability.append({
            "pharmacy": row[0],
            "location": row[1],
            "latitude": row[2],
            "longitude": row[3],
            "phone": row[4],
            "quantity": row[5],
            "last_updated": row[6]
        })

    # Get medicine information from OpenFDA API
    fda_info = get_medicine_info(medicine)
    
    return jsonify({
        "medicine": medicine,
        "availability": availability,
        "info": fda_info,
        "search_time": datetime.now().isoformat()
    })

def get_medicine_info(medicine_name):
    """Fetch medicine information from OpenFDA API"""
    try:
        # Map common medicine names to their generic equivalents for better API search
        medicine_mapping = {
            "paracetamol": "acetaminophen",
            "tylenol": "acetaminophen",
            "aspirin": "acetylsalicylic acid",
            "ibuprofen": "ibuprofen",
            "amoxicillin": "amoxicillin",
            "cetirizine": "cetirizine",
            "omeprazole": "omeprazole",
            "metformin": "metformin",
            "amlodipine": "amlodipine",
            "atorvastatin": "atorvastatin",
            "losartan": "losartan",
            "metoprolol": "metoprolol",
            "lisinopril": "lisinopril"
        }
        
        # Use mapped name if available, otherwise use original
        search_name = medicine_mapping.get(medicine_name.lower(), medicine_name)
        
        # Try multiple search strategies for better results
        search_terms = [
            f"openfda.generic_name:{search_name}",
            f"openfda.brand_name:{search_name}",
            f"openfda.substance_name:{search_name}",
            f"openfda.product_ndc:{search_name}",
            f"openfda.generic_name:{search_name}+openfda.product_type:HUMAN_OTC_DRUG",
            f"openfda.generic_name:{search_name}+openfda.route:ORAL"
        ]
        
        for search_term in search_terms:
            fda_url = f"{app.config['OPENFDA_API_URL']}?search={search_term}&limit=1"
            try:
                print(f"Trying OpenFDA search: {search_term}")
                response = requests.get(fda_url, timeout=app.config['REQUEST_TIMEOUT'])
                print(f"OpenFDA response status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    results = data.get("results", [])
                    if results:
                        result = results[0]
                        openfda = result.get("openfda", {})
                        
                        # Validate that this is the right type of medicine (prefer oral medications)
                        product_type = openfda.get("product_type", [])
                        route = openfda.get("route", [])
                        
                        # Skip if it's not a human drug or if it's not oral (unless we're specifically looking for non-oral)
                        if "HUMAN" not in str(product_type) or ("ORAL" not in str(route) and "TOPICAL" not in str(route) and "INJECTION" not in str(route)):
                            print(f"Skipping non-oral/non-human drug: {product_type}, {route}")
                            continue
                        
                        # Extract and clean the data
                        generic_name = openfda.get("generic_name", ["N/A"])[0] if openfda.get("generic_name") else "N/A"
                        purpose = result.get("purpose", ["N/A"])[0] if result.get("purpose") else "N/A"
                        warnings = result.get("warnings", ["N/A"])[0] if result.get("warnings") else "N/A"
                        dosage = result.get("dosage_and_administration", ["N/A"])[0] if result.get("dosage_and_administration") else "N/A"
                        indications = result.get("indications_and_usage", ["N/A"])[0] if result.get("indications_and_usage") else "N/A"
                        
                        # Clean up the text (remove extra whitespace and limit length)
                        def clean_text(text, max_length=200):
                            if text and text != "N/A":
                                cleaned = " ".join(text.split())
                                return cleaned[:max_length] + "..." if len(cleaned) > max_length else cleaned
                            return text
                        
                        print(f"Successfully fetched from OpenFDA: {generic_name}")
                        return {
                            "generic_name": clean_text(generic_name),
                            "purpose": clean_text(purpose),
                            "warnings": clean_text(warnings, 300),
                            "dosage": clean_text(dosage),
                            "indications": clean_text(indications),
                            "source": "OpenFDA API"
                        }
                    else:
                        print(f"No results found for search term: {search_term}")
            except requests.RequestException as e:
                print(f"Request error for {search_term}: {e}")
                continue
            except Exception as e:
                print(f"Error processing response for {search_term}: {e}")
                continue
                
    except Exception as e:
        print(f"Error fetching FDA data: {e}")
    
    # Fallback information for common medicines (only if OpenFDA fails)
    print(f"Falling back to local database for: {medicine_name}")
    fallback_info = {
        "aspirin": {
            "generic_name": "Acetylsalicylic Acid",
            "purpose": "Pain reliever, fever reducer, anti-inflammatory",
            "warnings": "Do not exceed recommended dose. May cause stomach irritation.",
            "dosage": "325-650mg every 4-6 hours as needed",
            "indications": "Pain relief, fever reduction, cardiovascular protection"
        },
        "paracetamol": {
            "generic_name": "Acetaminophen",
            "purpose": "Pain reliever and fever reducer",
            "warnings": "Do not exceed 4g per day. May cause liver damage in overdose.",
            "dosage": "500-1000mg every 4-6 hours as needed",
            "indications": "Mild to moderate pain, fever reduction"
        },
        "amoxicillin": {
            "generic_name": "Amoxicillin",
            "purpose": "Antibiotic for bacterial infections",
            "warnings": "Complete full course. May cause allergic reactions.",
            "dosage": "250-500mg every 8 hours",
            "indications": "Bacterial infections, respiratory tract infections"
        }
    }
    
    medicine_lower = medicine_name.lower()
    if medicine_lower in fallback_info:
        info = fallback_info[medicine_lower].copy()
        info["source"] = "Local Database (OpenFDA unavailable)"
        return info
    
    return {
        "generic_name": "N/A",
        "purpose": "N/A",
        "warnings": "N/A",
        "dosage": "N/A",
        "indications": "N/A",
        "source": "OpenFDA API unavailable"
    }

@app.route("/api/pharmacy/update", methods=["POST"])
def update_stock():
    """Update medicine stock for a pharmacy"""
    try:
        data = request.json
        pharmacy_id = data.get("pharmacy_id")
        medicine_name = data.get("medicine_name", "").strip()
        quantity = data.get("quantity")
        
        if not all([pharmacy_id, medicine_name, quantity is not None]):
            return jsonify({"error": "pharmacy_id, medicine_name, and quantity are required"}), 400
        
        # Check if pharmacy exists
        pharmacy = query_db("SELECT id FROM pharmacies WHERE id = ?", (pharmacy_id,), one=True)
        if not pharmacy:
            return jsonify({"error": "Pharmacy not found"}), 404
        
        # Check if stock record exists
        existing = query_db(
            "SELECT id FROM stock WHERE pharmacy_id=? AND LOWER(medicine_name)=LOWER(?)",
            (pharmacy_id, medicine_name), one=True
        )
        
        if existing:
            query_db(
                "UPDATE stock SET quantity=?, last_updated=CURRENT_TIMESTAMP WHERE id=?",
                (quantity, existing[0])
            )
            message = "Stock updated successfully"
        else:
            query_db(
                "INSERT INTO stock (pharmacy_id, medicine_name, quantity) VALUES (?, ?, ?)",
                (pharmacy_id, medicine_name, quantity)
            )
            message = "New stock record created"
        
        return jsonify({
            "status": "success",
            "message": message,
            "pharmacy_id": pharmacy_id,
            "medicine_name": medicine_name,
            "quantity": quantity
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/pharmacy/inventory/<int:pharmacy_id>")
def get_inventory(pharmacy_id):
    """Get current inventory for a pharmacy"""
    try:
        # Check if pharmacy exists
        pharmacy = query_db("SELECT name FROM pharmacies WHERE id = ?", (pharmacy_id,), one=True)
        if not pharmacy:
            return jsonify({"error": "Pharmacy not found"}), 404
        
        # Get inventory
        inventory = query_db(
            """SELECT medicine_name, quantity, last_updated 
               FROM stock 
               WHERE pharmacy_id = ? 
               ORDER BY medicine_name""",
            (pharmacy_id,)
        )
        
        return jsonify({
            "pharmacy_id": pharmacy_id,
            "pharmacy_name": pharmacy[0],
            "inventory": [
                {
                    "medicine_name": row[0],
                    "quantity": row[1],
                    "last_updated": row[2]
                } for row in inventory
            ]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/pharmacies")
def get_pharmacies():
    """Get list of all pharmacies"""
    try:
        pharmacies = query_db(
            "SELECT id, name, location, latitude, longitude, phone, address FROM pharmacies"
        )
        
        return jsonify([
            {
                "id": row[0],
                "name": row[1],
                "location": row[2],
                "latitude": row[3],
                "longitude": row[4],
                "phone": row[5],
                "address": row[6]
            } for row in pharmacies
        ])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/pharmacies", methods=["POST"])
def add_pharmacy():
    """Add a new pharmacy to the system"""
    try:
        data = request.json
        name = data.get("name", "").strip()
        location = data.get("location", "").strip()
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        phone = data.get("phone", "").strip()
        address = data.get("address", "").strip()
        
        # Validate required fields
        if not all([name, location]):
            return jsonify({"error": "Name and location are required"}), 400
        
        # Validate latitude and longitude if provided
        if latitude is not None and (latitude < -90 or latitude > 90):
            return jsonify({"error": "Invalid latitude. Must be between -90 and 90"}), 400
        
        if longitude is not None and (longitude < -180 or longitude > 180):
            return jsonify({"error": "Invalid longitude. Must be between -180 and 180"}), 400
        
        # Check if pharmacy with same name and location already exists
        existing = query_db(
            "SELECT id FROM pharmacies WHERE LOWER(name) = LOWER(?) AND LOWER(location) = LOWER(?)",
            (name, location), one=True
        )
        
        if existing:
            return jsonify({"error": "A pharmacy with this name and location already exists"}), 409
        
        # Insert new pharmacy using the existing query_db function
        conn = sqlite3.connect(DB)
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO pharmacies (name, location, latitude, longitude, phone, address) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (name, location, latitude, longitude, phone, address)
        )
        pharmacy_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Get the inserted pharmacy data
        new_pharmacy = query_db(
            "SELECT id, name, location, latitude, longitude, phone, address FROM pharmacies WHERE id = ?",
            (pharmacy_id,), one=True
        )
        
        return jsonify({
            "status": "success",
            "message": "Pharmacy added successfully",
            "pharmacy": {
                "id": new_pharmacy[0],
                "name": new_pharmacy[1],
                "location": new_pharmacy[2],
                "latitude": new_pharmacy[3],
                "longitude": new_pharmacy[4],
                "phone": new_pharmacy[5],
                "address": new_pharmacy[6]
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    init_db()
    print("Starting Nabha Medicine Availability Tracker...")
    print("User Dashboard: http://localhost:5001")
    print("Pharmacy Dashboard: http://localhost:5001/pharmacy")
    app.run(debug=True, host='0.0.0.0', port=5001)
