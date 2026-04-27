import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./nearbyjobcard.style";
import { checkImageURL } from "../../../../utils";

const NearbyJobCard = ({ item, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        {/* <Image
          source={{
            uri: checkImageURL(job.employer_logo)
              ? job.employer_logo
              : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          }}
          resizeMode='contain'
          style={styles.logImage}
        /> */}
        <Image
                source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                resizeMode='contain'
                //style={styles.logoImage}
                 style={{ width: 100, height: 100 }}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {item?.classification}
        </Text>

        <Text style={styles.jobType}>{item?.classification}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NearbyJobCard;
