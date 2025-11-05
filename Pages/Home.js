import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Share,
  StatusBar,
  Pressable,
  Text,
  Animated as RNAnimated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CategoryChipsCard from "../components/CategoryChipsCard";
import SwipeQuotesStack from "../components/SwipeQuotesStack";
import { getQuotes } from "../api/quotesApi";
import { useDispatch } from "react-redux";
import { addFavorite } from "../store/favoritesSlice";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const TAGS = [
  "inspirational","success","happiness","love","life","positive",
  "health","friendship","leadership","business","attitude","work",
  "family","courage","dreams","education","wisdom","sports","money","faith"
];

const CINEMATIC_THEMES = {
  love: { colors: ["#ff6b9a", "#d63384"] },         
  success: { colors: ["#16a085", "#f4d03f"] },       
  inspirational: { colors: ["#4e54c8", "#8f94fb"] }, 
  happiness: { colors: ["#f7971e", "#ffd200"] },     
  life: { colors: ["#2b5876", "#4e4376"] },          
  positive: { colors: ["#00c6ff", "#0072ff"] },      
  health: { colors: ["#0bab64", "#3bb78f"] },        
  friendship: { colors: ["#74ebd5", "#9face6"] },    
  leadership: { colors: ["#f7971e", "#c02425"] },    
  business: { colors: ["#8360c3", "#2ebf91"] },      
  attitude: { colors: ["#c31432", "#89216b"] },     
  work: { colors: ["#11998e", "#38ef7d"] },          
  family: { colors: ["#ff9966", "#ff5e62"] },        
  courage: { colors: ["#f12711", "#f5af19"] },       
  dreams: { colors: ["#642b73", "#c6426e"] },        
  education: { colors: ["#1f4037", "#99f2c8"] },     
  wisdom: { colors: ["#141e30", "#243b55"] },        
  sports: { colors: ["#00b09b", "#96c93d"] },       
  money: { colors: ["#134E5E", "#71B280"] },         
  faith: { colors: ["#5f2c82", "#49a09d"] },         
  default: { colors: ["#4e54c8", "#8f94fb"] },
};

const BASE_BG = ["#0B0E14", "#121826"];

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex({ r, g, b }) {
  const c = (n) => n.toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function mixHex(c1, c2, ratio = 0.5) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  const r = Math.round(a.r * (1 - ratio) + b.r * ratio);
  const g = Math.round(a.g * (1 - ratio) + b.g * ratio);
  const bC = Math.round(a.b * (1 - ratio) + b.b * ratio);
  return rgbToHex({ r, g, b: bC });
}
function addAlpha(hex, alpha = 0.35) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#111111" : "#FFFFFF";
}

export default function Home() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [quotes, setQuotes] = useState([]);
  const [selectedTag, setSelectedTag] = useState("inspirational");
  const [showCats, setShowCats] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useRef(new RNAnimated.Value(1)).current;
  const toastOpacity = useRef(new RNAnimated.Value(0)).current;
  const toastTranslateY = useRef(new RNAnimated.Value(40)).current;

  const glow = useSharedValue(0);

  const theme = CINEMATIC_THEMES[selectedTag] || CINEMATIC_THEMES.default;
  const blended = mixHex(theme.colors[0], theme.colors[1], 0.5);
  const contrastText = getContrastColor(blended);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 3400, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true
    );
  }, []);

  const fadeBG = () => {
    RNAnimated.sequence([
      RNAnimated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const showSavedToast = () => {
    RNAnimated.sequence([
      RNAnimated.parallel([
        RNAnimated.timing(toastOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        RNAnimated.timing(toastTranslateY, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]),
      RNAnimated.delay(1200),
      RNAnimated.parallel([
        RNAnimated.timing(toastOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        RNAnimated.timing(toastTranslateY, { toValue: 40, duration: 180, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const onFavorite = (q) => {
    dispatch(addFavorite(q));
    showSavedToast();
  };

  const onShare = (q) => {
    Share.share({ message: `"${q.quote}" — ${q.author}` }).catch(() => {});
  };

  const loadQuotes = async (tag = selectedTag) => {
    setError("");
    setLoading(true);
    try {
      const result = await getQuotes(tag, 3);
      setQuotes(result);
    } catch (e) {
      setError("Could not load quotes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes("inspirational");
  }, []);

  const onSelectCategory = (tag) => {
    setSelectedTag(tag);
    setShowCats(false);
    setQuotes([]);
    fadeBG();
    loadQuotes(tag);
  };

  const onEmpty = () => loadQuotes(selectedTag);

  const TAB_BAR_HEIGHT = 60;
  const FLOATING_MARGIN = Platform.OS === "ios" ? 16 : 12;
  const toastBottom = (insets?.bottom || 0) + TAB_BAR_HEIGHT + FLOATING_MARGIN;

  const glowStyleA = useAnimatedStyle(() => ({
    opacity: 0.25 + glow.value * 0.25, 
    transform: [{ scale: 1 + glow.value * 0.12 }], 
  }));
  const glowStyleB = useAnimatedStyle(() => ({
    opacity: 0.18 + (1 - glow.value) * 0.22, 
    transform: [{ scale: 1.08 - glow.value * 0.1 }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={BASE_BG} style={styles.absoluteFill} />
      <RNAnimated.View style={[styles.absoluteFill, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[addAlpha(theme.colors[0], 0.45), addAlpha(theme.colors[1], 0.45)]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.absoluteFill}
        />
      </RNAnimated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowBlob,
          glowStyleA,
          { backgroundColor: addAlpha(theme.colors[0], 0.45) },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowBlob,
          glowStyleB,
          { backgroundColor: addAlpha(theme.colors[1], 0.40) },
        ]}
      />
      <View pointerEvents="none" style={styles.vignette} />

      <StatusBar barStyle="light-content" />

      <RNAnimated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslateY }],
            bottom: toastBottom,
          },
        ]}
      >
        <Text style={styles.toastText}>❤️ Added to Favorites</Text>
      </RNAnimated.View>

      <RNAnimated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: contrastText }]}>QuoteSpace</Text>
          <Text style={[styles.subtitle, { color: addAlpha(contrastText, 0.8) }]}>
            Daily inspiration
          </Text>
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={() => loadQuotes(selectedTag)}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: addAlpha("#FFFFFF", contrastText === "#FFFFFF" ? 0.12 : 0.14),
                borderColor: addAlpha(contrastText, 0.22),
              },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={[styles.primaryBtnText, { color: contrastText }]}>
              New {selectedTag} Quotes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShowCats((s) => !s)}
            style={({ pressed }) => [
              styles.outlineBtn,
              {
                borderColor: addAlpha(contrastText, 0.28),
                backgroundColor: addAlpha(contrastText, 0.06),
              },
              pressed && { opacity: 0.88 },
            ]}
          >
            <Text style={[styles.outlineBtnText, { color: contrastText }]}>
              {selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)} ▼
            </Text>
          </Pressable>
        </View>
        <CategoryChipsCard
          expanded={showCats}
          selected={selectedTag}
          onSelect={onSelectCategory}
          tags={TAGS}
        />
        <View style={styles.content}>
          {loading && <ActivityIndicator size="large" color={contrastText} />}

          {!!error && (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={[styles.error, { color: contrastText }]}>{error}</Text>
              <Pressable
                onPress={() => loadQuotes(selectedTag)}
                style={[
                  styles.retryBtn,
                  {
                    backgroundColor: addAlpha(contrastText, 0.12),
                    borderColor: addAlpha(contrastText, 0.25),
                  },
                ]}
              >
                <Text style={[styles.retryText, { color: contrastText }]}>Retry</Text>
              </Pressable>
            </View>
          )}

          {!loading && !error && quotes.length > 0 && (
            <SwipeQuotesStack
              quotes={quotes}
              onEmpty={onEmpty}
              onFavorite={onFavorite}
              onShare={onShare}
            />
          )}
        </View>
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: { ...StyleSheet.absoluteFillObject },

  container: { flex: 1, paddingTop: 56, paddingHorizontal: 12 },
  header: { marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { marginTop: 2 },
  row: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 8 },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  primaryBtnText: { fontWeight: "800", textAlign: "center" },
  outlineBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  outlineBtnText: { fontWeight: "800" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 14, width: "100%" },
  error: { fontSize: 16, marginBottom: 10 },
  retryBtn: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1, marginTop: 6 },
  retryText: { fontWeight: "700" },
  glowBlob: {
    position: "absolute",
    left: -50,
    right: -50,
    top: -80,
    bottom: -40,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 2,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(20, 23, 28, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
  },
  toastText: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
