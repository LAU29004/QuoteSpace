import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Share } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite, clearFavorites } from "../store/favoritesSlice";
import { LinearGradient } from "expo-linear-gradient";

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

export default function Favorites() {
  const { items } = useSelector((s) => s.favorites);
  const dispatch = useDispatch();

  const shareItem = (item) => Share.share({ message: `"${item.quote}" — ${item.author}` });

  return (
    <LinearGradient colors={["#d76d77", "#ffaf7b"]} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Favorites</Text>

        {items.length > 0 && (
          <Pressable
            onPress={() => dispatch(clearFavorites())}
            style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>
      {items.length === 0 ? (
        <Text style={styles.empty}>No favorites yet. Tap “Favorite” on a quote to save it.</Text>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={items}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          renderItem={({ item }) => {
            const theme = CATEGORY_THEMES[item?.tag] || CATEGORY_THEMES.default;
            return (
              <LinearGradient colors={theme.colors} style={styles.card}>
                <Text style={[styles.quote, { color: theme.textColor }]}>
                  "{item.quote}"
                </Text>
                <Text style={[styles.author, { color: theme.textColor }]}>— {item.author}</Text>

                <View style={styles.rowBtns}>
                  <Pressable
                    onPress={() => dispatch(removeFavorite(item.id))}
                    style={[styles.btn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
                  >
                    <Text style={[styles.btnText, { color: theme.textColor }]}>Remove</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => shareItem(item)}
                    style={[styles.btn, { borderWidth: 1, borderColor: theme.textColor }]}
                  >
                    <Text style={[styles.btnText, { color: theme.textColor }]}>Share</Text>
                  </Pressable>
                </View>
              </LinearGradient>
            );
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { color: "white", fontSize: 26, fontWeight: "800" },
  clearBtn: { borderWidth: 1, borderColor: "white", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  clearText: { color: "white", fontWeight: "700" },
  empty: { color: "white", opacity: 0.85, marginTop: 40, textAlign: "center", fontSize: 16 },
  card: {
    borderRadius: 16,
    padding: 18,
    width: "100%",
    elevation: 3,
  },
  quote: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  author: { fontSize: 14, opacity: 0.9 },
  rowBtns: { flexDirection: "row", gap: 10, marginTop: 12, justifyContent: "flex-end" },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  btnText: { fontWeight: "800" },
});
