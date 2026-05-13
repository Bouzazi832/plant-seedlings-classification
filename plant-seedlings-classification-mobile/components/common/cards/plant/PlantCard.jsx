import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./plantcard.style";

const PlantCard = ({ item, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
                source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                resizeMode='contain'
                 style={{ width: 100, height: 100 }}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.plantName} numberOfLines={1}>
          {item?.classification}
        </Text>

        <Text style={styles.plantType}>{item?.classification}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlantCard;
