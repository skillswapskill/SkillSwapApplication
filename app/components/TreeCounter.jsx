import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TreeCounter() {
  const [count, setCount] = useState(1000);

  useEffect(() => {
    let interval;

    if (count) {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [count]);

  return (
    <LinearGradient
      colors={["#d4fcd4", "#b2f5b2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name="sprout" size={20} color="green" />
        <Text style={styles.label}>Number of Trees Planted</Text>
        <MaterialCommunityIcons name="sprout" size={20} color="green" />
      </View>
      <Text style={styles.count}>{count.toLocaleString()}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "green",
    marginHorizontal: 8,
  },
  count: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
  },
});
