import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type User = {
  image: string;
  name: string;
};

type UserSectionProps = {
  title: string;
  onSeeAll: () => void;
  users: User[];
};

export default function UserSection({ title, onSeeAll, users }: UserSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const handleSeeAll = () => {
    setExpanded(!expanded); // toggle view
    onSeeAll();
  };

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>{expanded ? "Users" : "See All Users"}</Text>
        </TouchableOpacity>
      </View>

      {/* If expanded → Grid view, else → Horizontal scroll */}
      {expanded ? (
        <View style={styles.gridContainer}>
          {users.map((user, index) => (
            <View key={index} style={styles.gridItem}>
              <Image source={{ uri: user.image }} style={styles.avatar} />
              <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Image source={{ uri: user.image }} style={styles.avatar} />
              <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 15,
    top: 50,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: "#007BFF",
  },
  userCard: {
    alignItems: "center",
    marginRight: 15,
    width: 70,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
  // Grid styles
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap:22,
    justifyContent: "flex-start",
  },
  gridItem: {
    width: "20%", // 5 per row
    alignItems: "center",
    marginBottom: 15,
  },
});
