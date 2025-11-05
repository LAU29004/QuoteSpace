// components/SwipeQuotesStack.js
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

// 🎨 Category-based Theme Colors
const CATEGORY_THEMES = {
  love: { colors: ["#ff9a9e", "#fecfef"], textColor: "#4a001f" },
  success: { colors: ["#56ab2f", "#a8e063"], textColor: "#073b00" },
  inspirational: { colors: ["#232526", "#414345"], textColor: "#ffffff" },
  happiness: { colors: ["#f6d365", "#fda085"], textColor: "#4a2c00" },
  life: { colors: ["#5C258D", "#4389A2"], textColor: "#ffffff" },
  positive: { colors: ["#00c6ff", "#0072ff"], textColor: "#ffffff" },
  health: { colors: ["#11998e", "#38ef7d"], textColor: "#003a2e" },
  friendship: { colors: ["#9CECFB", "#65C7F7"], textColor: "#034d6d" },
  leadership: { colors: ["#FDBB2D", "#C31900"], textColor: "#3a1f00" },
  business: { colors: ["#8360c3", "#2ebf91"], textColor: "#0b003a" },
  attitude: { colors: ["#c31432", "#240b36"], textColor: "#ffffff" },
  work: { colors: ["#2980B9", "#6DD5FA"], textColor: "#012b44" },
  family: { colors: ["#ffecd2", "#fcb69f"], textColor: "#5a2900" },
  courage: { colors: ["#f12711", "#f5af19"], textColor: "#3d1a00" },
  dreams: { colors: ["#7F00FF", "#E100FF"], textColor: "#ffffff" },
  education: { colors: ["#1f4037", "#99f2c8"], textColor: "#00291c" },
  wisdom: { colors: ["#1e3c72", "#2a5298"], textColor: "#ffffff" },
  sports: { colors: ["#00b09b", "#96c93d"], textColor: "#002e0d" },
  money: { colors: ["#134E5E", "#71B280"], textColor: "#001e26" },
  faith: { colors: ["#4e54c8", "#8f94fb"], textColor: "#0a0036" },

  default: { colors: ["#232526", "#414345"], textColor: "#ffffff" },
};

export default function SwipeQuotesStack({ quotes = [], onEmpty, onFavorite, onShare }) {
  const [index, setIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const current = quotes[index];
  const next = quotes[index + 1];

  const theme = CATEGORY_THEMES[current?.tag] || CATEGORY_THEMES.default;
  const nextTheme = CATEGORY_THEMES[next?.tag] || CATEGORY_THEMES.default;

  const rotate = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-10deg", "0deg", "10deg"],
  });

  const nextScale = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [0.96, 0.98, 0.96],
    extrapolate: "clamp",
  });

  const release = (toX) => {
    Animated.timing(pan, { toValue: { x: toX, y: 0 }, duration: 220, useNativeDriver: true })
      .start(() => {
        pan.setValue({ x: 0, y: 0 });
        const newIndex = index + 1;
        setIndex(newIndex);
        if (newIndex >= quotes.length) onEmpty?.();
      });
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) release(width + 80);
          else if (g.dx < -SWIPE_THRESHOLD) release(-width - 80);
          else
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        },
      }),
    [index]
  );

  if (!current) return null;

  return (
    <View style={styles.container}>
      {next && (
        <Animated.View style={[styles.card, { transform: [{ scale: nextScale }] }]}>
          <LinearGradient colors={nextTheme.colors} style={styles.grad}>
            <Text style={[styles.quote, { color: nextTheme.textColor }]}>"{next.quote}"</Text>
            <Text style={[styles.author, { color: nextTheme.textColor }]}>— {next.author}</Text>
          </LinearGradient>
        </Animated.View>
      )}

      <Animated.View
        {...responder.panHandlers}
        style={[styles.card, { transform: [{ rotate }, ...pan.getTranslateTransform()] }]}
      >
        <LinearGradient colors={theme.colors} style={styles.grad}>
          <Text style={[styles.quote, { color: theme.textColor }]}>"{current.quote}"</Text>
          <Text style={[styles.author, { color: theme.textColor }]}>— {current.author}</Text>

          <View style={styles.actions}>
            <Pressable onPress={() => onFavorite?.(current)} style={styles.smallBtn}>
              <Text style={[styles.smallBtnText, { color: theme.textColor }]}>Favorite</Text>
            </Pressable>
            <Pressable onPress={() => onShare?.(current)} style={[styles.smallBtn, styles.smallBtnOutline]}>
              <Text style={{ color: theme.textColor, fontWeight: "800" }}>Share</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const H = 320;

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", justifyContent: "center" },
  card: {
    width: "100%",
    height: H,
    borderRadius: 18,
    overflow: "hidden",
    position: "absolute",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  grad: { flex: 1, padding: 18, justifyContent: "space-between" },
  quote: { fontSize: 20, lineHeight: 28, fontWeight: "700" },
  author: { fontSize: 14, marginTop: 6, opacity: 0.9 },
  actions: { flexDirection: "row", gap: 10, alignSelf: "flex-end" },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)" },
  smallBtnOutline: { borderWidth: 1, borderColor: "rgba(255,255,255,0.6)" },
  smallBtnText: { fontWeight: "800" },
});
