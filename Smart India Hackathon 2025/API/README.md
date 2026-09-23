# Nabha Medicine Availability Tracker

A real-time medicine stock and information system designed to improve healthcare access in rural areas, specifically for Nabha and surrounding villages in Punjab, India.

## 🎯 Problem Statement

Nabha and surrounding villages face severe healthcare access challenges:
- Local Civil Hospital operates at less than 50% staff capacity
- Patients from 173 villages travel long distances to buy medicines, often finding them out of stock
- Limited internet access (~31% households) and poor infrastructure
- Impact: Delayed treatment, worsened health outcomes, financial strain

## ✨ Features

### For Patients/Users
- 🔍 **Medicine Search**: Find medicines by name with real-time availability
- 🗺️ **Interactive Map**: View nearby pharmacies with stock information
- 📱 **Mobile-Friendly**: Optimized for mobile devices used in rural areas
- 🌐 **Multi-Language**: Support for English, Hindi, and Punjabi
- 📶 **Offline Support**: Works with poor internet connectivity
- 💊 **Medicine Information**: Detailed drug information via OpenFDA API

### For Pharmacies
- 📊 **Inventory Management**: Easy stock updates and tracking
- 📈 **Real-Time Dashboard**: View current inventory levels
- ⚠️ **Low Stock Alerts**: Automatic alerts for low inventory
- 📱 **Simple Interface**: Easy-to-use forms for rural pharmacists

## 🛠️ Technology Stack

- **Backend**: Flask (Python)
- **Database**: SQLite (MVP), MySQL/PostgreSQL (scalable)
- **Frontend**: HTML5, Bootstrap 5, JavaScript
- **Maps**: Google Maps API / OpenStreetMap
- **Medicine Data**: OpenFDA API
- **Offline Support**: Service Worker
- **Hosting**: Render / Railway / Heroku

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nabha-medicine-tracker
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize the database**
   ```bash
   sqlite3 pharmacy.db < schema.sql
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   - User Dashboard: http://localhost:5000
   - Pharmacy Dashboard: http://localhost:5000/pharmacy

### Google Maps Setup (Optional)

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `templates/user_dashboard.html` with your actual API key

## 📊 Database Schema

### Pharmacies Table
```sql
CREATE TABLE pharmacies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    phone TEXT,
    address TEXT
);
```

### Stock Table
```sql
CREATE TABLE stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pharmacy_id INTEGER NOT NULL,
    medicine_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id)
);
```

## 🔌 API Endpoints

### Search Medicine
```
GET /api/search?medicine=<medicine_name>
```
Returns medicine information and availability at nearby pharmacies.

### Update Stock
```
POST /api/pharmacy/update
Content-Type: application/json

{
    "pharmacy_id": 1,
    "medicine_name": "Aspirin",
    "quantity": 50
}
```

### Get Pharmacy Inventory
```
GET /api/pharmacy/inventory/<pharmacy_id>
```

### Get All Pharmacies
```
GET /api/pharmacies
```

## 🌍 Multi-Language Support

The application supports three languages:
- **English** (en)
- **Hindi** (hi) - हिंदी
- **Punjabi** (pa) - ਪੰਜਾਬੀ

Users can switch languages using the dropdown in the top-right corner.

## 📱 Offline Functionality

The application includes a Service Worker that:
- Caches essential resources for offline use
- Provides offline indicators
- Syncs data when connection is restored
- Supports background sync for better user experience

## 🗺️ Map Integration

- Interactive Google Maps showing pharmacy locations
- Real-time stock information on map markers
- Click-to-navigate functionality
- Responsive design for mobile devices

## 🧪 Sample Data

The database comes pre-populated with:
- 4 sample pharmacies in Nabha area
- 15+ common medicines with stock data
- Realistic coordinates for mapping

## 🔧 Configuration

### Environment Variables
- `FLASK_ENV`: Set to `development` or `production`
- `DATABASE_URL`: Database connection string (for production)

### Customization
- Update pharmacy locations in `schema.sql`
- Modify medicine fallback data in `app.py`
- Customize UI colors and branding in CSS

## 📈 Future Enhancements

- [ ] SMS/WhatsApp alerts for medicine availability
- [ ] Offline-first mobile app
- [ ] Analytics dashboard for health department
- [ ] Integration with Jan Aushadhi database
- [ ] Prescription upload and management
- [ ] Doctor recommendations
- [ ] Price comparison across pharmacies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenFDA for providing free medicine information API
- Google Maps for location services
- Bootstrap for responsive UI components
- The rural healthcare community in Punjab

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: [Your contact information]

## 🎯 Impact

This project aims to:
- Reduce medicine search time from hours to minutes
- Improve healthcare access for 173+ villages
- Support rural pharmacists with better inventory management
- Provide reliable medicine information in local languages
- Work effectively in low-connectivity areas

---

**Built with ❤️ for rural healthcare in Punjab, India**
