// components/UserProfileModal.tsx
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { User } from "./types"; // ✅ Import shared type

type Props = {
  user: User | null;
  onClose: () => void;
};

export default function UserProfileModal({ user, onClose }: Props) {
  if (!user) return null;

  return (
    <Modal transparent animationType="fade">
      {/* Blurred background */}
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.center}>
        <View style={styles.card}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ fontSize: 20 }}>✕</Text>
          </TouchableOpacity>

          {/* Profile Pic */}
          <Image source={{ uri: user.image }} style={styles.avatar} />

          {/* Name */}
          <Text style={styles.name}>{user.name}</Text>

         {/* Skills */}
         <View style={styles.skillsContainer}>
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, idx) => (
            <View key={idx} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
         </View>
        ))
      ) : (
    <Text style={styles.noSkillsText}>No skills added</Text>
  )}
</View>

          {/* Full Profile Button */}
          <TouchableOpacity onPress={() => console.log("Go to full profile")}>
            <LinearGradient
              colors={["#4b6cb7", "#182848"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileBtn}
            >
              <Text style={styles.profileBtnText}>👥 View Full Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  closeBtn: { position: "absolute", top: 10, right: 15 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b7dceff",
    textAlign: "center",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "center",
  },
  skillChip: {
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 5,
  },
  skillText: { fontSize: 14, color: "#007BFF" },
  noSkillsText:{fontSize: 14, color: "#007BFF"},
  profileBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  profileBtnText: { color: "#fff", fontWeight: "bold" },
});
