import { useState, useCallback } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import { COLORS, icons, SIZES } from "../constants";
import {
  AllPlants,
  PredictButton,
  ScreenHeaderBtn,
  Welcome,
} from "../components";

const Home = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh AllPlants every time the home screen gains focus
  // (e.g., after returning from PredictPage with a new classification)
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "🌱 Plant Seedlings",
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={() => {
              if (searchTerm) {
                router.push(`/search/${searchTerm}`);
              }
            }}
          />

          <PredictButton />
          <AllPlants refreshKey={refreshKey} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
