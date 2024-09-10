import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";
import { hp, wp } from "../utility/responsive";
import Entypo from "@expo/vector-icons/Entypo";

const SearchScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState("");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: hp(7),
        backgroundColor: Color.colorDarkslateblue_100,
      }}
    >
      <View style={styles.searchInputBox}>
        <Entypo
          name="location"
          size={30}
          color={Color.colorBlack}
          style={styles.vectorIcon}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search a Place..."
          style={styles.inputField}
          onSubmitEditing={() => navigation.navigate("HomePage", { search })}
        />
      </View>
      <Image
        style={styles.image}
        contentFit="cover"
        source={require("../assets/image-1.png")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputField: {
    width: "100%",
    fontFamily: FontFamily.libreCaslonTextRegular,
    fontSize: FontSize.size_sm,
    backgroundColor: Color.colorWhite,
    color: Color.colorBlack,
    borderRadius: Border.br_5xs,
    padding: 10,
    paddingLeft: 45,
  },
  vectorIcon: {
    position: "absolute",
    left: 25,
    top: 10,
    zIndex: 1,
  },
  searchInputBox: {
    width: "100%",
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});

export default SearchScreen;
