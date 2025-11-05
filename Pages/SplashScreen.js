import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const FIREFLIES_COUNT = 40;
const FIREFLY_COLORS = ["#fff176", "#40c9ff", "#ff8ae2", "#a3ffb0"];

function Firefly({ size = 6 }) {
  const xStart = Math.random() * width;
  const yStart = Math.random() * height;

  const translateX = useSharedValue(xStart);
  const translateY = useSharedValue(yStart);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(xStart + (Math.random() * 90 - 45), { duration: 3600 }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(yStart + (Math.random() * 90 - 45), { duration: 4000 }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(Math.random() * 0.8 + 0.2, { duration: 2300 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const color = FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)];

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          position: "absolute",
          shadowColor: color,
          shadowOpacity: 0.9,
          shadowRadius: 8,
        },
      ]}
    />
  );
}

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Tabs");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {Array.from({ length: FIREFLIES_COUNT }).map((_, i) => (
        <Firefly key={i} size={Math.random() * 8 + 8} />
      ))}

      <LottieView
        source={require("../assets/QuoteSpace.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />

      <Text style={styles.appName}>QuoteSpace</Text>
      <Text style={styles.tagline}>Lighting up your thoughts...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffdfdff",
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 260,
    height: 260,
  },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 14,
    color: "#000000ff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    opacity: 0.65,
    marginTop: 4,
    color: "#000000ff",
  },
});
