import { StyleSheet } from "react-native";

import { FONT, SIZES, COLORS, SHADOWS } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
  },
  card: {
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginVertical: SIZES.small,
    alignItems: 'center',
    backgroundColor: COLORS.tertiary,
    ...SHADOWS.medium,
  },
  text: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  space: {
    marginVertical: 10,
  },
});

export default styles;
