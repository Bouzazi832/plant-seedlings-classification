import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES, SHADOWS } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
  },
  header: {
    marginTop: SIZES.xLarge,
    marginBottom: SIZES.xLarge,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginTop: SIZES.xSmall / 2,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.xLarge,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.gray2,
    ...SHADOWS.medium,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    textAlign: "center",
  },
  predictionContainer: {
    backgroundColor: "#E7F5ED",
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.xLarge,
    borderWidth: 1,
    borderColor: "#A3D9B1",
    alignItems: "center",
  },
  predictionLabel: {
    fontSize: SIZES.small,
    fontFamily: FONT.medium,
    color: "#2D6A4F",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  predictionValue: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.bold,
    color: "#1B4332",
    marginTop: SIZES.xSmall / 2,
  },
  actionContainer: {
    gap: SIZES.medium,
  },
  primaryBtn: {
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.small,
  },
  primaryBtnText: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.white,
  },
  secondaryBtn: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  secondaryBtnText: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  backBtn: {
    marginTop: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.small,
  },
  backBtnText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default styles;
