import tensorflow as tf
import os

MODEL_PATH = 'plant-seedlings-model'

print("Folder contents:", os.listdir(MODEL_PATH))
print("Assets contents:", os.listdir(f'{MODEL_PATH}/assets'))
print("Variables contents:", os.listdir(f'{MODEL_PATH}/variables'))

print("\nLoading model...")
converter = tf.keras.layers.TFSMLayer(MODEL_PATH, call_endpoint='serving_default')

inputs = tf.keras.Input(shape=(224, 224, 3))
outputs = converter(inputs)
keras_model = tf.keras.Model(inputs, outputs)

keras_model.save('plant-seedling-model.keras')
print("✅ Done! Saved as plant-seedling-model.keras")