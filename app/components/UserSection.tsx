// components/UserSection.tsx
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { User } from "./types"; // ✅ Import shared User type

type UserSectionProps = {
  title: string;
  onSeeAll: () => void;
  users: User[]; // ✅ now consistent with Dashboard + Modal
  onUserPress: (user: User) => void;
};

export default function UserSection({
  title,
  onSeeAll,
  users,
  onUserPress,
}: UserSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const handleSeeAll = () => {
    setExpanded(!expanded);
    onSeeAll();
  };

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>
            {expanded ? "Users" : "See All Users"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* If expanded → Grid view, else → Horizontal scroll */}
      {expanded ? (
        <View style={styles.gridContainer}>
          {users.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => onUserPress(user)}
            >
              <Image source={{ uri: user.profilePic }} style={styles.avatar} />
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {users.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userCard}
              onPress={() => onUserPress(user)}
            >
              <Image source={{ uri: user.profilePic }} style={styles.avatar} />
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>
            </TouchableOpacity>
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
    gap: 22,
    justifyContent: "flex-start",
  },
  gridItem: {
    width: "20%", // 5 per row
    alignItems: "center",
    marginBottom: 15,
  },
});
