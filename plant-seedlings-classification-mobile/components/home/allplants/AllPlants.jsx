import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

import styles from "./allplants.style";
import { COLORS, icons } from "../../../constants";
import PlantCard from "../../common/cards/plant/PlantCard";
import useFetch from "../../../hook/useFetch";

const AllPlants = ({ refreshKey = 0 }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, meta, isLoading, error, refetch } = useFetch(
    "getAllImages",
    { page, per_page: 10 },
    "images",
    [refreshKey, page]
  );

  const handlePagination = (direction) => {
    if (direction === "left" && page > 1) {
      setPage((p) => p - 1);
    } else if (direction === "right" && page < meta.total_pages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Plants</Text>
        <Text style={styles.headerSubtitle}>
          {meta.total} seedling{meta.total !== 1 ? "s" : ""} found
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : !data || data.length === 0 ? (
          <Text style={styles.emptyText}>No plants classified yet</Text>
        ) : (
          data.map((item) => (
            <PlantCard
              item={item}
              key={`plant-${item.filename}`}
              handleNavigate={() =>
                router.push(`/details/${item.filename}`)
              }
            />
          ))
        )}
      </View>

      {/* Pagination controls */}
      {meta.total_pages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              page <= 1 && styles.paginationButtonDisabled,
            ]}
            onPress={() => handlePagination("left")}
            disabled={page <= 1}
          >
            <Image
              source={icons.chevronLeft}
              style={styles.paginationImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.paginationTextBox}>
            <Text style={styles.paginationText}>
              {page} / {meta.total_pages}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              page >= meta.total_pages && styles.paginationButtonDisabled,
            ]}
            onPress={() => handlePagination("right")}
            disabled={page >= meta.total_pages}
          >
            <Image
              source={icons.chevronRight}
              style={styles.paginationImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AllPlants;
