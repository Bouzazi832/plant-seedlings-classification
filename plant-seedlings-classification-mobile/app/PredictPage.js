import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRouter, Stack } from 'expo-router';
import styles from "./predict.style";
import { API_BASE_URL, COLORS } from '../constants';

const PredictPage = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
        setPrediction(null);
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

      setIsUploading(true);

      const formData = new FormData();
      formData.append('images[]', {
        uri: selectedImage.uri,
        type: 'image/png',
        name: 'photo.png',
      });

      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        const predictionValue = firstResult.prediction;
        setPrediction(predictionValue);
      } else {
        alert('Unexpected response format. Please check the server response.');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "Classify Seedling",
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Plant Classifier</Text>
          <Text style={styles.headerSubtitle}>Upload a photo to identify the species</Text>
        </View>

        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} resizeMode="cover" />
          ) : (
            <Text style={styles.placeholderText}>No image selected yet</Text>
          )}
          {isUploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.tertiary} />
            </View>
          )}
        </View>

        {prediction && (
          <View style={styles.predictionContainer}>
            <Text style={styles.predictionLabel}>Identified Species</Text>
            <Text style={styles.predictionValue}>🌱 {prediction}</Text>
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={handleImagePicker}
            disabled={isUploading}
          >
            <Text style={styles.secondaryBtnText}>Select from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.primaryBtn, (!selectedImage || isUploading) && { opacity: 0.7 }]} 
            onPress={handleUpload}
            disabled={!selectedImage || isUploading}
          >
            <Text style={styles.primaryBtnText}>
              {isUploading ? "Processing..." : "Classify Now"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PredictPage;
