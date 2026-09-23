"""
Configuration file for Nabha Medicine Availability Tracker
"""

import os

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'nabha-medicine-tracker-2024'
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'pharmacy.db'
    OPENFDA_API_URL = 'https://api.fda.gov/drug/label.json'
    GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY') or 'YOUR_GOOGLE_MAPS_API_KEY'
    
    # Application settings
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    HOST = os.environ.get('HOST') or '0.0.0.0'
    PORT = int(os.environ.get('PORT') or 5000)
    
    # Database settings
    DATABASE_TIMEOUT = 30
    
    # API settings
    REQUEST_TIMEOUT = 5
    MAX_RETRIES = 3
    
    # Cache settings
    CACHE_TIMEOUT = 300  # 5 minutes
    
    # Language settings
    SUPPORTED_LANGUAGES = ['en', 'hi', 'pa']
    DEFAULT_LANGUAGE = 'en'
    
    # Map settings
    DEFAULT_LATITUDE = 30.3760  # Nabha coordinates
    DEFAULT_LONGITUDE = 76.1530
    DEFAULT_ZOOM = 14
    
    # Medicine settings
    LOW_STOCK_THRESHOLD = 10
    OUT_OF_STOCK_THRESHOLD = 0
    
    # Offline settings
    CACHE_SIZE_LIMIT = 50  # MB
    OFFLINE_CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    DATABASE_URL = 'test_pharmacy.db'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
