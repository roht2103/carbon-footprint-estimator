from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Global variables for model and encoders
model = None
transport_encoder = None
diet_encoder = None

def load_model_and_encoders():
    """Load the trained model and label encoders"""
    global model, transport_encoder, diet_encoder
    
    try:
        # Load the trained RandomForestRegressor model
        with open('carbon_model.pkl', 'rb') as file:
            model = pickle.load(file)
        logger.info("Carbon model loaded successfully from carbon_model.pkl")
        
        # Create label encoders with the same mappings used in training
        # These should match exactly what was used during model training
        transport_encoder = {
            'car': 0,
            'bus': 1,
            'train': 2,
            'bike': 3
        }
        
        diet_encoder = {
            'vegan': 0,
            'vegetarian': 1,
            'mixed': 2
        }
        
        logger.info("Label encoders initialized successfully")
        
    except FileNotFoundError:
        logger.error("carbon_model.pkl file not found. Please ensure the trained model is in the container.")
        raise
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

# Load model when module is imported (works with Gunicorn)
try:
    load_model_and_encoders()
except Exception as e:
    logger.error(f"Failed to load model on startup: {e}")
    model = None

def encode_categorical_features(transport_mode, diet_type):
    """Encode categorical features using the same encoding as training"""
    try:
        # Encode transport mode
        if transport_mode.lower() not in transport_encoder:
            raise ValueError(f"Invalid transport_mode: {transport_mode}. Valid options: {list(transport_encoder.keys())}")
        transport_encoded = transport_encoder[transport_mode.lower()]
        
        # Encode diet type
        if diet_type.lower() not in diet_encoder:
            raise ValueError(f"Invalid diet_type: {diet_type}. Valid options: {list(diet_encoder.keys())}")
        diet_encoded = diet_encoder[diet_type.lower()]
        
        return transport_encoded, diet_encoded
    
    except Exception as e:
        logger.error(f"Error encoding categorical features: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'message': 'Carbon Footprint Prediction API is running'
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Predict carbon footprint based on input features"""
    try:
        # Check if model is loaded, try to load if not
        global model
        if model is None:
            logger.info("Model not loaded, attempting to load...")
            load_model_and_encoders()
            
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = ['transport_mode', 'km_per_day', 'diet_type', 'electricity_kWh_per_day', 'waste_kg_per_day']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        # Extract and validate input values
        try:
            transport_mode = str(data['transport_mode']).strip()
            km_per_day = float(data['km_per_day'])
            diet_type = str(data['diet_type']).strip()
            electricity_kwh_per_day = float(data['electricity_kWh_per_day'])
            waste_kg_per_day = float(data['waste_kg_per_day'])
            
            # Validate numerical inputs
            if km_per_day < 0 or electricity_kwh_per_day < 0 or waste_kg_per_day < 0:
                return jsonify({'error': 'Numerical values must be non-negative'}), 400
            
        except (ValueError, TypeError) as e:
            return jsonify({'error': f'Invalid input format: {str(e)}'}), 400
        
        # Encode categorical features
        try:
            transport_encoded, diet_encoded = encode_categorical_features(transport_mode, diet_type)
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        # Prepare features for prediction
        # Feature order should match the training data: 
        # [transport_mode_encoded, km_per_day, diet_type_encoded, electricity_kWh_per_day, waste_kg_per_day]
        features = np.array([[transport_encoded, km_per_day, diet_encoded, electricity_kwh_per_day, waste_kg_per_day]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Ensure prediction is positive and round to 2 decimal places
        carbon_footprint = max(0, round(float(prediction), 2))
        
        logger.info(f"Prediction made: {carbon_footprint} kg CO2 for input: {data}")
        
        # Return prediction
        return jsonify({
            'carbon_footprint': carbon_footprint,
            'input_features': {
                'transport_mode': transport_mode,
                'km_per_day': km_per_day,
                'diet_type': diet_type,
                'electricity_kWh_per_day': electricity_kwh_per_day,
                'waste_kg_per_day': waste_kg_per_day
            },
            'status': 'success'
        }), 200
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error during prediction'}), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'message': 'Carbon Footprint Prediction API',
        'version': '1.0.0',
        'endpoints': {
            'GET /': 'API information',
            'GET /health': 'Health check',
            'POST /predict': 'Predict carbon footprint'
        },
        'predict_endpoint_example': {
            'url': '/predict',
            'method': 'POST',
            'content_type': 'application/json',
            'body': {
                'transport_mode': 'car',
                'km_per_day': 25,
                'diet_type': 'mixed',
                'electricity_kWh_per_day': 12.5,
                'waste_kg_per_day': 1.8
            }
        }
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    try:
        # Start Flask app
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        exit(1)