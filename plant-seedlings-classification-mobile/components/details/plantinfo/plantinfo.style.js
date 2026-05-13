import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBox: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: SIZES.large,
  },
  plantImage: {
    width: "90%",
    height: "90%",
    borderRadius: SIZES.medium,
  },
  titleBox: {
    marginTop: SIZES.small,
  },
  plantTitle: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontFamily: FONT.bold,
    textAlign: "center",
  },
  classificationBox: {
    marginTop: SIZES.small / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  classificationText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontFamily: FONT.medium,
  },
});

export default styles;
