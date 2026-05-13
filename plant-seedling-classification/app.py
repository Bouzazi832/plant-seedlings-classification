from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import os
import base64
import uuid
from database import get_db_connection
from tensorflow.keras.models import load_model
# pyrefly: ignore [missing-import]
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import keras
keras.config.enable_unsafe_deserialization()
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (development only)

model = load_model('plant-seedlings-model/plant-seedling-model.keras')

# Define the uploads folder
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to save the image to the uploads folder
def save_uploaded_image(file):
    unique_filename = str(uuid.uuid4()) + '_' + file.filename
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    return unique_filename

# Function to store classification in the MySQL database
def store_classification(filename, classification):
    db_conn = None
    try:
        db_conn = get_db_connection()
        with db_conn.cursor() as cursor:
            sql = "INSERT INTO classifications ( filename, classification) VALUES (%s, %s)"
            cursor.execute(sql, (filename, classification))
        db_conn.commit()
    except Exception as e:
        print("Error storing classification in the database:", e)
        if db_conn:
            db_conn.rollback()
    finally:
        if db_conn:
            db_conn.close()

def preprocess_image(img_array):
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array


@app.route('/getAllImages', methods=['GET'])
def get_all_images_with_classification():
    db_conn = None
    try:
        # Pagination params
        try:
            page = max(1, int(request.args.get('page', 1)))
            per_page = max(1, min(100, int(request.args.get('per_page', 10))))
        except (ValueError, TypeError):
            page = 1
            per_page = 10

        db_conn = get_db_connection()
        with db_conn.cursor() as cursor:
            # Count total records
            cursor.execute("SELECT COUNT(*) as total FROM classifications")
            total = cursor.fetchone()['total']

            # Fetch paginated records ordered by newest first
            offset = (page - 1) * per_page
            sql = ("SELECT filename, classification, created_at "
                   "FROM classifications "
                   "ORDER BY created_at DESC "
                   "LIMIT %s OFFSET %s")
            cursor.execute(sql, (per_page, offset))
            images_data = cursor.fetchall()

            images = []
            for data in images_data:
                filename = data['filename']
                classification = data['classification']
                created_at = data['created_at'].isoformat() if data['created_at'] else None
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                if os.path.isfile(file_path):
                    with open(file_path, 'rb') as image_file:
                        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

                    image_info = {
                        'filename': filename,
                        'classification': classification,
                        'created_at': created_at,
                        'image': encoded_image,
                    }
                    images.append(image_info)

            total_pages = max(1, (total + per_page - 1) // per_page)
            return jsonify({
                'images': images,
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': total_pages,
            })

    except Exception as e:
        print("Error getting all images from the database:", e)
        return jsonify({'error': 'Internal Server Error'})
    finally:
        if db_conn:
            db_conn.close()

@app.route('/getOneImage/<filename>', methods=['GET'])
def get_image_with_classification(filename):
    db_conn = None
    try:
        db_conn = get_db_connection()
        with db_conn.cursor() as cursor:
            sql = "SELECT classification FROM classifications WHERE filename = %s"
            cursor.execute(sql, (filename,))
            classification_data = cursor.fetchone()
            if not classification_data:
                print(f"No classification found for image '{filename}'.")
                return jsonify({'error': 'Classification not found'})

            classification = classification_data['classification']
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            if not os.path.isfile(file_path):
                print("File does not exist.")
                return jsonify({'error': 'File not found'})

            # Read the image file and encode it as a base64 string
            with open(file_path, 'rb') as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

            response_data = {
                'filename': filename,
                'classification': classification,
                'image': encoded_image,
            }

            return jsonify(response_data)
    except Exception as e:
        print(f"Error getting image '{filename}' with classification:", e)
        return jsonify({'error': 'Internal Server Error'})
    finally:
        if db_conn:
            db_conn.close()

@app.route('/getAllImagesByClassification', methods=['GET'])
def getAllImagesByClassification():
    # Get the classification parameter from the request
    classification = request.args.get('query')
    db_conn = None
    try:
        db_conn = get_db_connection()
        with db_conn.cursor() as cursor:
            # Fetch all filenames based on classification from the database
            sql = "SELECT filename FROM classifications WHERE classification = %s"
            cursor.execute(sql, (classification,))
            filename_data = cursor.fetchall()

            if not filename_data:
                print(f"No filenames found for classification '{classification}'.")
                return jsonify({'error': 'Classification not found'})

            response_data = []

            for row in filename_data:
                filename = row['filename']
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                if not os.path.isfile(file_path):
                    print(f"File does not exist for filename '{filename}'.")
                    continue

                # Read the image file and encode it as a base64 string
                with open(file_path, 'rb') as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

                image_data = {
                    'filename': filename,
                    'classification': classification,
                    'image': encoded_image,
                }

                response_data.append(image_data)

            return jsonify(response_data)
    except Exception as e:
        print(f"Error getting images with classification '{classification}':", e)
        return jsonify({'error': 'Internal Server Error'})
    finally:
        if db_conn:
            db_conn.close()


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Check if files are included in the request
        if 'images[]' not in request.files:
            return jsonify({'error': 'No files provided'})

        uploaded_files = request.files.getlist('images[]')

        results = []

        for uploaded_file in uploaded_files:
            # Check if the file is a valid image
            if uploaded_file.filename == '':
                return jsonify({'error': 'No file selected'})

            # Save the image to the uploads folder
            filename = save_uploaded_image(uploaded_file)

            img = image.load_img(os.path.join(app.config['UPLOAD_FOLDER'], filename), target_size=(224, 224))
            img_array = image.img_to_array(img)

            # Make predictions
            result = model.predict(preprocess_image(img_array))
            # Handle both dict output (TFSMLayer) and array output
            if isinstance(result, dict):
                result = list(result.values())[0]
            class_label = np.argmax(result)
            
            class_names = ['Black-grass', 'Charlock', 'Cleavers', 'Common Chickweed', 'Common wheat', 'Fat Hen', 'Loose Silky-bent', 'Maize', 'Scentless Mayweed', 'Shepherd’s Purse', 'Small-flowered Cranesbill', 'Sugar beet']
            predicted_class = class_names[class_label]

            if predicted_class in class_names:
                # Storing images in database
                store_classification(filename,predicted_class)

                # Append image path and prediction to results list
                results.append({
                    'image': filename,
                    'prediction': predicted_class
                })

    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
