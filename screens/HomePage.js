import React, { useEffect, useState } from "react";
import { TouchableOpacity, Linking } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import Entypo from "@expo/vector-icons/Entypo";
import { hp, wp } from "../utility/responsive";
import { fetchLocationData, getCurrentTemperature } from "../utility/apicall";
import { currentConditionsData } from "../utility/constant";
import { StatusBar } from "expo-status-bar";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const HomePage = ({ route }) => {
  const navigation = useNavigation();

  const searchText = route.params?.search.toLowerCase() ?? "";
  const [form, setForm] = useState({
    ph: null,
    temperature: null,
    currentSpeed: null,
    currentDirection: null,
    salinity: null,
    turbidity: null,
  });
  const [cityData, setCityData] = useState({
    temperature: null,
    currentText: null,
    icon: null,
  });
  const [suitability, setSuitability] = useState("Perfect");
  const [loading, setLoading] = useState(false);
  const [temperatureSubText, setTemperatureSubText] = useState("");
  const [phSubText, setPhSubText] = useState("");
  const [currentSpeedSubText, setCurrentSpeedSubText] = useState("");
  const [currentDirectionSubText, setCurrentDirectionSubText] = useState("");
  const [salinitySubText, setSalinitySubText] = useState("");
  const [turbiditySubText, setTurbiditySubText] = useState("");

useEffect(() => {
  if (!searchText) {
    navigation.navigate("Search");
  } else {
    setLoading(true);
    Promise.all([
      fetchLocationData(searchText, "temperature"),
      fetchLocationData(searchText, "ph"),
      fetchLocationData(searchText, "currentspeed"),
      fetchLocationData(searchText, "currentdirection"),
      fetchLocationData(searchText, "turbidity"),
      fetchLocationData(searchText, "salinity"),
      getCurrentTemperature(searchText),
    ])
      .then(
        ([
          temperatureData,
          phData,
          currentspeedData,
          currentdirectionData,
          turbidityData,
          salinityData,
          cityData,
        ]) => {
          const temperature = parseFloat(temperatureData.temperature[0]).toFixed(2);
          const ph = parseFloat(phData.ph[0]).toFixed(2);
          const currentSpeed = parseFloat(currentspeedData.currentspeed[0]).toFixed(2);
          const currentDirection = parseFloat(currentdirectionData.currentdirection[0]).toFixed(2);
          const turbidity = parseFloat(turbidityData.turbidity[0]).toFixed(2);
          const salinity = parseFloat(salinityData.salinity[0]).toFixed(2);

          setForm({
            temperature,
            ph,
            currentSpeed,
            currentDirection,
            turbidity,
            salinity,
          });
          setCityData({
            temperature: cityData.current.temp_c,
            currentText: cityData.current.condition.text,
            icon: cityData.current.condition.icon,
          });

          // Example conditions to update subtext
          setTemperatureSubText(temperature > 30 ? "Too Hot" : "Optimal");
          setPhSubText(ph < 7 ? "Acidic" : "Neutral");
          setCurrentSpeedSubText(currentSpeed > 3 ? "Strong Current" : "Calm");
          setCurrentDirectionSubText("Direction data not available"); // Add your conditions
          setSalinitySubText(salinity < 30 ? "Low Salinity" : "High Salinity");
          setTurbiditySubText(turbidity > 5 ? "High Turbidity" : "Clear");

          const suitability = checkSuitability({ temperature, ph, currentSpeed, turbidity, salinity });
          setSuitability(suitability);

          setLoading(false);
        }
      )
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }
}, [route.params]);



  if (loading) {
    return (
      <>
        <StatusBar style="light" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: Color.colorDarkslateblue_100,
          }}
        >
          <ActivityIndicator size={50} color={"white"} />
        </View>
      </>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: hp(6),
        paddingHorizontal: wp(2),
        backgroundColor: Color.colorDarkslateblue_100,
      }}
    >
      <ScrollView style={styles.homePage}>
        <Pressable
          style={styles.location}
          onPress={() => navigation.navigate("Search")}
        >
          <Entypo
            name="location"
            size={30}
            color={Color.colorBlack}
            style={styles.vectorIcon}
          />
          <Text style={styles.searchWord}>{searchText}</Text>
        </Pressable>
        <View style={styles.currentTemp}>
          <View>
            <Text style={styles.now}>Now</Text>
            <Text style={styles.text}>{cityData.temperature}°</Text>
            <Text style={styles.subText}>{cityData.currentText}</Text>
          </View>
          <Image
            style={styles.imageStyle}
            contentFit="contain"
            source={{ uri: `https:${cityData.icon}` }}
          />
        </View>
        <View
          style={[
            styles.rectangular,
            suitability === "Warning"
              ? { backgroundColor: "#FFA500" }
              : suitability === "Danger"
              ? { backgroundColor: "#FF0000" }
              : { backgroundColor: "#008000" },
          ]}
        >
          <View>
            {suitability === "Danger" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Image
                  source={require("../assets/eme.png")}
                  style={[
                    styles.rectImg,
                    {
                      height: 50,
                      width: 50,
                      borderWidth: 2,
                    },
                  ]}
                />
                <View>
                  <Text style={styles.rectText}>
                    Alert! High danger conditions
                  </Text>
                  <Text style={styles.rectText}>
                    Stay away from the beach side
                  </Text>
                </View>
              </View>
            )}
            {suitability === "Warning" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Image
                  source={require("../assets/eye.png")}
                  style={[
                    styles.rectImg,
                    {
                      height: 50,
                      width: 50,
                    },
                  ]}
                />
                <View>
                  <Text style={styles.rectText}>Warning! Check conditions</Text>
                  <Text style={styles.rectText}>
                    Exercise caution at the beach
                  </Text>
                </View>
              </View>
            )}
            {suitability === "Perfect" && (
              <>
                <Text style={styles.rectText}>Perfect day for the beach!</Text>
                <Text style={styles.rectText}>Enjoy your time!</Text>
              </>
            )}
          </View>
        </View>

        <Text
          style={{
            paddingTop: 20,
            color: Color.colorWhite,
            fontFamily: FontFamily.libreCaslonTextRegular,
            fontSize: FontSize.size_mid,
          }}
        >
          Current Conditions
        </Text>
        <View style={styles.cards}>
          {currentConditionsData.map((val, ind) => {
            const imgPath = val.icon;
            let subText;

            // Setting subText based on formText
            if (val.formText === "temperature") {
              subText = temperatureSubText;
            } else if (val.formText === "ph") {
              subText = phSubText;
            } else if (val.formText === "currentSpeed") {
              subText = currentSpeedSubText;
            } else if (val.formText === "currentDirection") {
              subText = currentDirectionSubText;
            } else if (val.formText === "salinity") {
              subText = salinitySubText;
            } else {
              subText = turbiditySubText;
            }

            return (
              <View style={styles.card} key={val.title}>
                <Text style={styles.cardText}>{val.title}</Text>
                {val.formText === "temperature" ? (
                  <FontAwesome5
                    name="temperature-high"
                    size={80}
                    color="#391b57"
                    style={{
                      alignSelf: "center",
                    }}
                  />
                ) : (
                  <Image source={imgPath} style={styles.cardImg} />
                )}
                <View>
                  <Text style={[styles.cardText, { fontWeight: "bold" }]}>
                    {val.formText === "ph"
                      ? ` ≈${form.ph}`
                      : val.formText === "currentDirection"
                      ? form.currentDirection
                      : val.formText === "currentSpeed"
                      ? form.currentSpeed
                      : val.formText === "temperature"
                      ? form.temperature
                      : val.formText === "salinity"
                      ? form.salinity
                      : form.turbidity}
                  </Text>
                  <Text style={[styles.cardText, { fontWeight: "bold" }]}>
                    {subText}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.beachCondition}>
          <View>
            <Text
              style={{
                paddingVertical: 10,
                fontSize: 20,
                fontWeight: "black",
              }}
            >
              Beach condition
            </Text>
            {["Clean", "Crowded", "Safe"].map((txt, ind) => (
              <View
                key={txt}
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Text
                  style={{
                    fontSize: FontSize.size_mid,
                    fontWeight: "bold",
                  }}
                >
                  {txt}
                </Text>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                  }}
                  contentFit="cover"
                  source={require("../assets/star3.png")}
                />
              </View>
            ))}
          </View>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 120,
                width: 120,
              }}
              contentFit="contain"
              source={require("../assets/group-11.png")}
            />
            <Text style={[styles.ratingBasedOn, styles.oceanTypo]}>
              *rating based on tourists
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL('https://forms.gle/74TLN6wrNoukBXvr7')}>
        <LinearGradient
          locations={[0, 0.5, 1]}
          start={{
            x: 0,
            y: 1,
          }}
          colors={["#9fc6ff", "#89d1cd", "#b836d8"]}
          style={{
            padding: 15,
            alignItems: "center",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: Color.colorBlack, fontSize: 20 }}>
            Rate your experience
          </Text>
          <Text style={{ color: Color.colorBlack, fontSize: 20 }}>
            Click to take survey
          </Text>
        </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  vectorIcon: {
    left: 10,
  },
  searchWord: {
    position: "absolute",
    top: 12,
    left: 60,
    fontSize: FontSize.size_xl,
    fontFamily: FontFamily.libreCaslonTextRegular,
    color: Color.colorBlack,
    textAlign: "left",
  },
  location: {
    height: hp(6),
    width: "100%",
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorGainsboro,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  now: {
    fontFamily: FontFamily.abyssinicaSILRegular,
    fontSize: 30,
    color: Color.colorWhite,
    textAlign: "left",
  },
  text: {
    fontSize: FontSize.size_46xl,
    color: Color.colorWhite,
    fontFamily: FontFamily.abyssinicaSILRegular,
    textAlign: "left",
  },
  subText: {
    fontSize: FontSize.size_mid,
    color: Color.colorWhite,
    fontFamily: FontFamily.abyssinicaSILRegular,
    textAlign: "left",
  },
  imageStyle: {
    height: hp(15),
    width: "70%",
  },
  currentTemp: {
    height: "auto",
    width: "100%",
    paddingHorizontal: wp(1),
    flexDirection: "row",
    paddingVertical: hp(2),
    alignItems: "start",
  },
  homePage: {
    borderRadius: Border.br_7xs,
    width: "100%",
  },
  rectangular: {
    height: hp(10),
    width: "100%",
    borderRadius: Border.br_7xs,
    backgroundColor: Color.colorRed_100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rectText: {
    fontSize: FontSize.size_lg,
    color: Color.colorWhite,
    fontFamily: FontFamily.libreCaslonTextRegular,
    textAlign: "center",
  },
  rectImg: {
    height: hp(5),
    width: "50%",
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    columnGap: 2,
    rowGap: 10,
    paddingTop: hp(3),
  },
  card: {
    height: hp(30),
    width: "48%",
    backgroundColor: "#D9D9D9",
    justifyContent: "space-around",
    borderRadius: 10,
  },
  cardText: {
    fontFamily: FontFamily.libreCaslonTextRegular,
    fontSize: FontSize.size_xl,
    fontWeight: "500",
    paddingLeft: 10,
  },
  cardImg: {
    height: 70,
    width: 70,
    alignSelf: "center",
  },
  beachCondition: {
    backgroundColor: "#D9D9D9",
    marginVertical: 20,
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
  },
});

export default HomePage;
