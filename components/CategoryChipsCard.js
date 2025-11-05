// components/CategoryChipsCard.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function Chip({ tag, selected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 110, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
    ]).start();
    onPress?.(tag);
  };
  const selectedStyle = selected === tag;

  return (
    <Pressable onPress={tap} style={{ marginRight: 10, marginBottom: 10 }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={selectedStyle ? ["#8e2de2", "#4a00e0"] : ["#e7e7e7", "#d5d5d5"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.chip, selectedStyle && styles.chipSelected]}
        >
          <Text style={[styles.chipText, { color: selectedStyle ? "#fff" : "#333" }]}>
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export default function CategoryChipsCard({ expanded, selected, onSelect, tags = [] }) {
  const [h, setH] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: expanded ? 1 : 0, duration: 220, useNativeDriver: false }).start();
  }, [expanded]);

  const styleInterp = useMemo(() => {
    const maxH = anim.interpolate({ inputRange: [0, 1], outputRange: [0, h || 1] });
    const opacity = anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.2, 1] });
    return { maxHeight: maxH, opacity };
  }, [anim, h]);

  return (
    <Animated.View style={[styles.cardOuter, styleInterp]}>
      <View style={styles.cardInner} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
        <Text style={styles.cardTitle}>Choose a category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {tags.map((t) => (
            <Chip key={t} tag={t} selected={selected} onPress={onSelect} />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: { overflow: "hidden", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.10)", marginTop: 10 },
  cardInner: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },
  cardTitle: { color: "white", fontWeight: "700", marginBottom: 10, fontSize: 16 },
  row: { flexDirection: "row", flexWrap: "nowrap", paddingBottom: 6 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  chipSelected: { elevation: 3 },
  chipText: { fontSize: 14, fontWeight: "700", letterSpacing: 0.2 },
});
