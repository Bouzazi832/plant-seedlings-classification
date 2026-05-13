import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from "./predictbutton.style";
import { Link } from 'expo-router';

const PredictButton = () => {
  return (
    <Link href="/PredictPage" asChild>
      <Pressable style={styles.card}>
        <Text style={styles.text}>🌱 Predict Now</Text>
      </Pressable>
    </Link>
  );
};

export default PredictButton;
