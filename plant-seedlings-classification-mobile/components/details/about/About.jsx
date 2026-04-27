import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function About() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access camera roll is required!');
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
  
    if (result.canceled) {
      console.log('Image picking canceled');
    } else {
      const source = { uri: result.uri };
      setSelectedImage(source);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {selectedImage && <Image source={selectedImage} style={{ width: 200, height: 200 }} />}
      <Button title="Pick an image" onPress={handleImagePicker} />
    </View>
  );
}
