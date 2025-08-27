import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-paper";
import Footer from "../components/footer";
import ProfileMenu from "../components/ProfileMenu";
import { User } from "../components/types";

type Session = {
  _id: string;
  name: string;
  credits: number;
  dateTime?: string;
  teacher: string;
  learner?: string;
  description?: string;
};

const ProfileScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const initialUser: User | null = params.user
    ? JSON.parse(params.user as string)
    : null;

  const [user, setUser] = useState<User | null>(initialUser);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const welcomeOpen = () => {
    router.push("/welcome");
    console.log("✅ Mongo userId:", user?._id);
  };

  /**
   * Fetch MongoDB _id from /users/all
   */
  useEffect(() => {
    const fetchMongoUserId = async () => {
      if (!user) return;

      // if already has _id, don’t re-fetch
      if (user._id) return;

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/all`
        );
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        console.log("✅ Users API response:", data);

        // normalize: handle both array or { users: [] }
        const allUsers = Array.isArray(data) ? data : data.users;

        if (!allUsers || !Array.isArray(allUsers)) {
          throw new Error("Users array not found in API response");
        }

        const matched = allUsers.find(
          (u: any) => u.clerkId === user.clerkId || u.email === user.email
        );

        if (matched) {
          setUser({
            ...user,
            _id: matched._id,
            profilePic: matched.profilePic ?? user.profilePic,
          });
        } else {
          console.warn("❌ Could not find user in DB for clerkId:", user.clerkId);
        }
      } catch (err) {
        console.error("❌ Error fetching Mongo _id:", err);
      }
    };

    fetchMongoUserId();
  }, [user?.clerkId]);

  /**
   * Fetch sessions once we have Mongo _id
   */
  useEffect(() => {
    const fetchUserAndSessions = async () => {
      if (!user?._id) return; // wait for Mongo _id

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/sessions/${user._id}`
        );

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        console.log("✅ Sessions response:", data);

        const sessionsData = Array.isArray(data) ? data : data.sessions || [];

        const formattedSessions = sessionsData.map((s: any) => ({
          _id: s._id,
          name: s.skill,
          credits: s.creditsUsed,
          dateTime: s.dateTime,
          teacher: s.teacher,
          learner: s.learner,
          description: s.description,
        }));

        setSessions(formattedSessions);
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSessions();
  }, [user?._id]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container1}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={welcomeOpen}>
          <Image
            source={require("../../assets/images/skillSwap.png")}
            style={styles.logo}
          />
          <Text style={styles.title1}>SkillSwap</Text>
        </TouchableOpacity>
        <ProfileMenu />
      </View>
      <View style={styles.separator} />

      <ScrollView style={styles.container}>
        {/* User Info Card */}
        <Card style={styles.userCard}>
          <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          {user.email && <Text>{user.email}</Text>}

          <View style={styles.skillsContainer}>
            {user.skills?.length > 0 ? (
              user.skills.map((skill, i) => (
                <View key={i} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.skillText}>No skills listed</Text>
            )}
          </View>

          <View style={styles.creditsRow}>
            <Text style={styles.creditLabel}>Credits</Text>
            <Text style={styles.creditValue}>{user.totalCredits ?? 300}</Text>
          </View>

          <Text style={styles.rating}>User Rating: 4.5 ⭐</Text>
        </Card>

        {/* Sessions Section */}
        <Text style={styles.sectionTitle}>
          📚 Sessions offered by {user.name}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
        ) : sessions.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            No sessions available yet.
          </Text>
        ) : (
          sessions.map((session) => (
            <Card key={session._id} style={styles.sessionCard}>
              <Text style={styles.sessionTitle}>{session.name}</Text>
              <Text style={styles.sessionDetail}>
                💰 Requires {session.credits} credits
              </Text>
              {session.dateTime && (
                <>
                  <Text style={styles.sessionDetail}>
                    📅 {new Date(session.dateTime).toLocaleDateString()}
                  </Text>
                  <Text style={styles.sessionDetail}>
                    ⏰ {new Date(session.dateTime).toLocaleTimeString()}
                  </Text>
                </>
              )}
              {session.learner && (
                <Text style={styles.bookedText}>🔒 Already booked</Text>
              )}
            </Card>
          ))
        )}

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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: { flex: 1 },
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  navbar: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "#aeadadff",
    marginVertical: 6,
    bottom: 4,
  },
  logo: { top: 10, width: 40, height: 40, resizeMode: "contain" },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b7dceff",
    position: "relative",
    left: 45,
    bottom: 25,
  },
  userCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    elevation: 5,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    justifyContent: "center",
  },
  skillBadge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
  },
  skillText: { color: "#0369a1", fontWeight: "500" },
  creditsRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  creditLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
    color: "#1e40af",
  },
  creditValue: { fontSize: 18, fontWeight: "bold", color: "green" },
  rating: { fontSize: 16, fontWeight: "600", marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  sessionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 3,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1e40af",
  },
  sessionDetail: { fontSize: 14, marginBottom: 2 },
  bookedText: { color: "red", marginTop: 4, fontWeight: "bold" },
  floatingIcon: {
    position: "absolute",
    bottom: 30,
    left: 0,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  iconImage: { width: 24, height: 24 },
  footer: { bottom: 10 },
});

export default ProfileScreen;
