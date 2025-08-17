// screens/DashBoard.js
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Footer from "../components/footer";
import ProfileMenu from "../components/ProfileMenu";
import TreeCounter from "../components/TreeCounter";
import UserSection from "../components/UserSection";

export default function DashBoard() {
  const [greeting, setGreeting] = useState("");
  const [background, setBackground] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Greeting logic
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning ☀️");
      setBackground("#ecf5b7ff");
    } else if (hours >= 12 && hours < 20) {
      setGreeting("Good Evening 🌤️");
      setBackground("#edb7f5ff");
    } else {
      setGreeting("Good Night 🌙");
      setBackground("#b7d5f5ff");
    }

    // Fetch real users from your backend
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://api.skillswappt.onrender.com/users/all");
        const data = await res.json();

        // Clerk returns users with firstName, lastName, imageUrl
        const formatted = data.map((u: { firstName: any; lastName: any; imageUrl: any; }) => ({
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          image: u.imageUrl,
        }));

        setUsers(formatted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <LinearGradient
      colors={["#f9fafb", background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image source={require("../../assets/images/skillSwap.png")} style={styles.logo} />
        <ProfileMenu />
      </View>

      {/* Greeting Banner */}
      <LinearGradient
        colors={["#d8e6ff", "#c5c3f3ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Text style={styles.bannerText}>{greeting}, Sagar</Text>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
        ) : (
          <UserSection
            title="Popular Users"
            users={users}
            onSeeAll={() => console.log("See All Popular Users")}
          />
        )}
      </ScrollView>

      <TreeCounter />

      {/* Floating Icon */}
      <View style={styles.floatingIcon}>
        <Image source={require("../../assets/images/skillSwap.png")} style={styles.iconImage} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  navbar: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  banner: {
    padding: 20,
    top: 30,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  bannerText: { fontSize: 20, fontWeight: "bold", color: "#a90060" },
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
  footer: { bottom: 10 },
});
