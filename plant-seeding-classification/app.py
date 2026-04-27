from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import os
import base64
import uuid
import pymysql.cursors
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (development only)

# MySQL database configuration
db_connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='plants_classification',
    cursorclass=pymysql.cursors.DictCursor
)

# Load the MobileNetV2 model
model = load_model('model\plant-seeding-model.h5')

# Define the uploads folder
UPLOAD_FOLDER = 'static\\uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to save the image to the uploads folder
def save_uploaded_image(file):
    unique_filename = str(uuid.uuid4()) + '_' + file.filename
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    return unique_filename

# Function to store classification in the MySQL database
def store_classification(filename, classification):
    try:
        with db_connection.cursor() as cursor:
            sql = "INSERT INTO classifications ( filename, classification) VALUES (%s, %s)"
            cursor.execute(sql, (filename, classification))
        db_connection.commit()
    except Exception as e:
        print("Error storing classification in the database:", e)
        db_connection.rollback()

def preprocess_image(img_array):
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/getAllImages', methods=['GET'])
def get_all_images_with_classification():
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT filename, classification FROM classifications"
            cursor.execute(sql)
            images_data = cursor.fetchall()
            print(images_data)
            images = []
            for data in images_data:
                filename = data['filename']
                classification = data['classification']
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                if os.path.isfile(file_path):
                    with open(file_path, 'rb') as image_file:
                        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

                    image_info = {
                        'filename': filename,
                        'classification': classification,
                        'image': encoded_image,
                    }

                    images.append(image_info)

            return jsonify({'images': images})

    except Exception as e:
        print("Error getting all images from the database:", e)
        return jsonify({'error': 'Internal Server Error'})

@app.route('/getOneImage/<filename>', methods=['GET'])
def get_image_with_classification(filename):
    try:
        with db_connection.cursor() as cursor:
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

@app.route('/getAllImagesByClassification', methods=['GET'])
def getAllImagesByClassification():
    # Get the classification parameter from the request
    classification = request.args.get('query')
    try:
        with db_connection.cursor() as cursor:
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
    app.run(debug=True)
