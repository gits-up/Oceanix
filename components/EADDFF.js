import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";

const EADDFF = () => {
  return <Text style={styles.eaddff}>EADDFF</Text>;
};

const styles = StyleSheet.create({
  eaddff: {
    fontSize: 50,
    fontFamily: FontFamily.abyssinicaSILRegular,
    color: Color.colorWhite,
    textAlign: "left",
  },
});

export default EADDFF;
