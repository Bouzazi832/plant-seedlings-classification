import React from "react";
import { View, Text, Image } from "react-native";

import styles from "./plantinfo.style";

const PlantInfo = ({ plantImage, plantName, classification }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        {plantImage ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${plantImage}` }}
            style={styles.plantImage}
            resizeMode="contain"
          />
        ) : null}
      </View>

      <View style={styles.titleBox}>
        <Text style={styles.plantTitle}>{plantName}</Text>
      </View>

      <View style={styles.classificationBox}>
        <Text style={styles.classificationText}>
          Classification: {classification}
        </Text>
      </View>
    </View>
  );
};

export default PlantInfo;
