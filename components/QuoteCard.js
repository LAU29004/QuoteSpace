import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function QuoteCard({
  quote,
  author,
  onPrimaryPress,
  primaryLabel,
  onSecondaryPress,
  secondaryLabel,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.quote}>"{quote}"</Text>
      <Text style={styles.author}>— {author}</Text>

      <View style={styles.row}>
        {onPrimaryPress && (
          <Pressable onPress={onPrimaryPress} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
            <Text style={styles.btnText}>{primaryLabel}</Text>
          </Pressable>
        )}
        {onSecondaryPress && (
          <Pressable onPress={onSecondaryPress} style={({ pressed }) => [styles.btnOutline, pressed && styles.pressed]}>
            <Text style={styles.btnOutlineText}>{secondaryLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    elevation: 4,
  },
  quote: { fontSize: 20, lineHeight: 28, fontWeight: "600", color: "#0f172a" },
  author: { fontSize: 14, color: "#475569" },
  row: { flexDirection: "row", gap: 12, marginTop: 6 },
  btn: { backgroundColor: "#3b82f6", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "700" },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  btnOutlineText: { color: "#3b82f6", fontWeight: "700" },
  pressed: { opacity: 0.8 },
});
