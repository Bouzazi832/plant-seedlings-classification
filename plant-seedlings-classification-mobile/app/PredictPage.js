import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import styles from "../components/home/popular/popularjobs.style";

const PredictPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedImage) {
        alert('Please select an image first.');
        return;
      }

      const formData = new FormData();
     formData.append('images[]', {
  uri: selectedImage.uri,
  type: 'image/png',
  name: 'photo.png',
});

      const response = await axios.post('http://192.168.43.50:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);

      // Assuming the response data structure is as you've mentioned
      if (response.data && response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        const predictionValue = firstResult.prediction;

        // Update the state with the prediction value
        setPrediction(predictionValue);
      } else {
        // Handle the case when the response structure is unexpected
        alert('Unexpected response format. Please check the server response.');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
      alert('Error uploading image. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={{ width: 200, height: 200, marginBottom: 10 }} />
      )}
      {prediction && (
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Prediction: {prediction}
        </Text>
      )}
      <View style={styles.buttonContainer}>
      <Button title="Select Image" onPress={handleImagePicker} />
      <View style={styles.space} />
      <Button title="Upload Image" onPress={handleUpload} />
    </View>
    </View>
  );
};

export default PredictPage;
