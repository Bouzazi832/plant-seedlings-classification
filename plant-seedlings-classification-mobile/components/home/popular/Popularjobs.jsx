import React from 'react';
import { View, Text,Pressable,TouchableOpacity  } from 'react-native';
import styles from "./popularjobs.style";
import PopularJobCard from "../../common/cards/popular/PopularJobCard";
import { useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
const Popularjobs = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const handleCardPress = () => {

    navigation.navigate('PredictPage');
  };

  return (
    
    <Link href="/PredictPage" asChild>
      <Pressable style={styles.card}>
      <Text style={styles.text}>Predict Now</Text>
      </Pressable>
    </Link>
  );
};

export default Popularjobs;
