import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ProfileMenu from "../components/ProfileMenu";
import Footer from "../components/footer";
import apiClient from "../config/apiClient"; // ✅ use centralized axios instance

// --- Mock User ID ---
// In a real app, get this from auth (Clerk/Firebase/etc.)
const MOCK_MONGO_USER_ID = "6899f5a03b0b2dae07a04810";

export default function MySessions() {
  const [activeTab, setActiveTab] = useState<"learning" | "teaching">("learning");

  // State for storing sessions and loading status
  type Session = {
    _id: string;
    skill: string;
    dateTime: string;
    teacher?: { name?: string };
    learner?: { name?: string };
  };

  const [learningSessions, setLearningSessions] = useState<Session[]>([]);
  const [teachingSessions, setTeachingSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (MOCK_MONGO_USER_ID) {
      fetchAllSessions(MOCK_MONGO_USER_ID);
    }
  }, []);

  // ✅ now using apiClient instead of axios
  const fetchAllSessions = async (mongoUserId: string) => {
    setLoading(true);
    try {
      const [learningRes, teachingRes] = await Promise.all([
        apiClient.get(`/sessions/subscribed-by-mongo/${mongoUserId}`),
        apiClient.get(`/sessions/teaching/${mongoUserId}`)
      ]);

      const sortedLearning = Array.isArray(learningRes.data)
        ? learningRes.data.sort(
            (a, b) =>
              new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          )
        : [];

      const sortedTeaching = Array.isArray(teachingRes.data)
        ? teachingRes.data.sort(
            (a, b) =>
              new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          )
        : [];

      setLearningSessions(sortedLearning);
      setTeachingSessions(sortedTeaching);
    } catch (error) {
      console.error("❌ Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSessionItem = ({ item }: { item: Session }) => {
    const participant =
      activeTab === "learning"
        ? `Teacher: ${item.teacher?.name || "N/A"}`
        : `Student: ${item.learner?.name || "N/A"}`;

    return (
      <View style={styles.sessionBox}>
        <Text style={styles.sessionSkillText}>{item.skill}</Text>
        <Text style={styles.sessionDetailText}>
          {new Date(item.dateTime).toLocaleString()}
        </Text>
        <Text style={styles.sessionDetailText}>{participant}</Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>
            {activeTab === "learning" ? "🚀 Join Meeting" : "👥 Start Teaching"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#0056ff"
          style={{ marginTop: 50 }}
        />
      );
    }

    const sessions = activeTab === "learning" ? learningSessions : teachingSessions;
    const emptyMessage =
      activeTab === "learning"
        ? "No learning sessions yet. Book one to get started!"
        : "No teaching sessions booked yet.";

    if (sessions.length === 0) {
      return (
        <View style={styles.emptySessionBox}>
          <Text style={styles.sessionText}>{emptyMessage}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  };

  return (
    <View style={styles.container1}>
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/skillSwap.png")}
            style={styles.logo}
          />
          <Text style={styles.title1}>SkillSwap</Text>
        </TouchableOpacity>
        <ProfileMenu />
      </View>
      <View style={styles.separator} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>📘 My Sessions</Text>
        </View>

        {/* Toggle Tabs */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "learning" && styles.activeTab]}
            onPress={() => setActiveTab("learning")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "learning" && styles.activeTabText,
              ]}
            >
              My Learning ({learningSessions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "teaching" && styles.activeTab]}
            onPress={() => setActiveTab("teaching")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "teaching" && styles.activeTabText,
              ]}
            >
              My Teaching ({teachingSessions.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>{renderContent()}</View>
      </View>

      {/* Floating Icon */}
      <View style={styles.floatingIcon}>
        <Image
          source={require("../../assets/images/skillSwap.png")}
          style={styles.iconImage}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: { flex: 1, backgroundColor: "#f1f1f1" },
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: { marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#0056ff" },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#0056ff" },
  tabText: { fontSize: 16, color: "#333", fontWeight: "600" },
  navbar: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 6 },
  logo: { top: 10, width: 40, height: 40, resizeMode: "contain" },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b7dceff",
    position: "relative",
    left: 45,
    bottom: 25,
  },
  activeTabText: { color: "#fff" },
  content: { flex: 1 },
  sessionBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#0056ff",
  },
  emptySessionBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  sessionText: { fontSize: 16, fontWeight: "500", color: "#555" },
  sessionSkillText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sessionDetailText: { fontSize: 14, color: "#666", marginBottom: 4 },
  joinButton: {
    marginTop: 15,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subText: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  floatingIcon: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  iconImage: { width: 24, height: 24 },
  footer: { position: "absolute", bottom: 0, width: "100%" },
});
