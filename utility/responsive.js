import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const hp = (percent) => {
  return (percent * height) / 100;
};

const wp = (percent) => {
  return (percent * width) / 100;
};

export { hp, wp };
