# -*- coding: utf-8 -*-
"""
Created on Mon May 11 15:37:56 2020

@author: Admin
"""

import numpy as np
import os
from keras.models import load_model
from keras.utils import load_img, img_to_array

import tensorflow as tf
from flask import Flask,request,render_template,jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

app=Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], supports_credentials=True)  # Enable CORS for React frontend

# Initialize model as None - we'll load it on first prediction request
model = None
model_loaded = False

def load_model_safely():
    global model, model_loaded
    if model_loaded:
        return model is not None
        
    try:
        print("Attempting to load model...")
        
        # Based on the debug output, we know the model architecture:
        # Conv2D(32) -> MaxPooling2D -> Flatten -> Dense(500) -> Dense(5)
        
        from keras.models import Sequential
        from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
        
        # Reconstruct the exact model architecture with correct input size
        model = Sequential([
            Conv2D(32, (3, 3), activation='relu', input_shape=(22, 22, 3)),
            MaxPooling2D(2, 2),
            Flatten(),
            Dense(500, activation='relu'),
            Dense(5, activation='softmax')
        ])
        
        # Load the weights
        model.load_weights("skindisease.h5")
        model_loaded = True
        print("Model loaded successfully by reconstructing architecture!")
        print("Model summary:")
        model.summary()
        return True
        
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
        model_loaded = True
        return False

@app.route('/')
def index():
    return render_template("base.html")

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'skin-disease-api',
        'model_loaded': model_loaded and model is not None
    })

@app.route('/predict',methods=['GET','POST'])
def upload():
    if request.method=='POST':
        print("Received prediction request")
        print("Request files:", request.files)
        print("Request form:", request.form)
        
        f=request.files.get('image')
        if not f or f.filename == '':
            print("No image file found in request")
            return jsonify({
                'success': False,
                'error': 'No image file selected'
            }), 400
            
        print("Processing image:", f.filename)
        print("File content type:", f.content_type)
        print("File size:", f.content_length)
        basepath=os.path.dirname(__file__)
        filepath=os.path.join(basepath, f.filename)
        f.save(filepath)
        
        try:
            # Try to load model if not already loaded
            if not load_model_safely():
                return jsonify({
                    'success': False,
                    'error': 'Could not load the prediction model. Please check the server logs for details.'
                }), 500
            else:
                # Real prediction with loaded model
                img = load_img(filepath, target_size=(22, 22))
                x = img_to_array(img)
                x = np.expand_dims(x, axis=0)
                x = x / 255.0  # Normalize the image
                
                # Make prediction
                preds = model.predict(x, verbose=0)
                print("Prediction probabilities:", preds)
                
                # Get the predicted class and confidence
                index = ['Acne', 'Melanoma', 'Peeling skin', 'Ring worm', 'Vitiligo']
                label = np.argmax(preds, axis=1)[0]
                confidence = np.max(preds) * 100
                
                disease = index[label]
                message = f"The Skin Disease is \"{disease}\" (Confidence: {confidence:.2f}%)"
                
                # Clean up the uploaded file
                if os.path.exists(filepath):
                    os.remove(filepath)
                
                return jsonify({
                    'success': True,
                    'prediction': message,
                    'disease': disease,
                    'confidence': float(round(confidence, 2))
                })
                
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            # Clean up the uploaded file
            if os.path.exists(filepath):
                os.remove(filepath)
            
            return jsonify({
                'success': False,
                'error': f'Error processing image: {str(e)}'
            }), 500
    else:
        return jsonify({
            'success': False,
            'error': 'Please upload an image'
        }), 400
        
    
if __name__=='__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(debug=True, threaded=False, port=port)