import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";
import Footer from "../components/footer";
import ProfileMenu from "../components/ProfileMenu";
import { User } from "../components/types";

type Session = {
  _id: string;
  title: string;
  requiredCredits: number;
  date: string;
  time: string;
  booked: boolean;
};


const ProfileScreen = () => {
  const params = useLocalSearchParams();
  const router=useRouter();
  const user: User = params.user ? JSON.parse(params.user as string) : null;

  const welcomeOpen = () => {
    router.push("/welcome");
  };

  // Mock session data or replace with API fetch
  const sessions: Session[] = [
    {
      _id: "1",
      title: "Philosophy",
      requiredCredits: 60,
      date: "21/08/2025",
      time: "16:22:34",
      booked: true,
    },
  ];

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
        <Image source={{ uri: user.image }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>

        <View style={styles.skillsContainer}>
          {user.skills.length > 0 ? (
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
          <Text style={styles.creditValue}>{300}</Text>
        </View>

        <Text style={styles.rating}>
          User Rating: {4.5} ⭐
        </Text>
      </Card>

      {/* Sessions Section */}
      <Text style={styles.sectionTitle}>
        📚 Sessions offered by {user.name}
      </Text>

      {sessions.map((session) => (
        <Card key={session._id} style={styles.sessionCard}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionDetail}>
            💰 Requires {session.requiredCredits} credits
          </Text>
          <Text style={styles.sessionDetail}>📅 {session.date}</Text>
          <Text style={styles.sessionDetail}>⏰ {session.time}</Text>
          {session.booked && (
            <Text style={styles.bookedText}>🔒 Already booked</Text>
          )}
        </Card>
      ))}
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
  container1:{flex:1},
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
  userName: { fontSize: 20, fontWeight: "bold", color: "#1e40af", marginBottom: 8 },
  skillsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12, justifyContent: "center" },
  skillBadge: { backgroundColor: "#e0f2fe", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, margin: 4 },
  skillText: { color: "#0369a1", fontWeight: "500" },
  creditsRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  creditLabel: { fontSize: 16, fontWeight: "600", marginRight: 6, color: "#1e40af" },
  creditValue: { fontSize: 18, fontWeight: "bold", color: "green" },
  rating: { fontSize: 16, fontWeight: "600", marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  sessionCard: { padding: 16, borderRadius: 12, marginBottom: 12, backgroundColor: "#fff", elevation: 3 },
  sessionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#1e40af" },
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
