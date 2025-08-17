// screens/DashBoard.js
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { JSX, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Footer from "../components/footer";
import ProfileMenu from "../components/ProfileMenu";
import { AfternoonScene, EveningScene, MorningScene, NightScene } from "../components/Scenes";
import TreeCounter from "../components/TreeCounter";
import UserSection from "../components/UserSection";

export default function DashBoard() {
  const [greeting, setGreeting] = useState("");
  const [background, setBackground] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SceneComponent, setSceneComponent] = useState<JSX.Element | null>(null);
  const router = useRouter();

  const welcomeOpen=()=>{
    router.push('/welcome');
  };

  useEffect(() => {
    // Greeting logic + scene
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning ☀️");
      setBackground("#ecf5b7ff");
      setSceneComponent(<MorningScene />);
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good Afternoon 🌤️");
      setBackground("#ffd27eff");
      setSceneComponent(<AfternoonScene />);
    } else if (hours >= 17 && hours < 20) {
      setGreeting("Good Evening 🌇");
      setBackground("#edb7f5ff");
      setSceneComponent(<EveningScene />);
    } else {
      setGreeting("Good Night 🌙");
      setBackground("#b7d5f5ff");
      setSceneComponent(<NightScene />);
    }

    // Fetch real users
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://skillswap.company/api/users/all");
        const data = await res.json();

        const formatted = data.users.map((u: { name: any; profilePic: any; }) => ({
          name: u.name,
          image: u.profilePic || "https://placehold.co/100x100",
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
  <View style={styles.container}>
    {/* Background gradient */}
    <LinearGradient
      colors={["#f9fafb", background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />

    {/* Scene overlay above gradient */}
    <View style={styles.sceneOverlay}>{SceneComponent}</View>

    {/* All your main content */}
    <View style={styles.content}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={welcomeOpen}>
          <Image source={require("../../assets/images/skillSwap.png")} style={styles.logo} />
          <Text style={styles.title1}>SkillSwap</Text>
        </TouchableOpacity>
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

      {/* Scroll content */}
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
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // gradient is absolute fill (already handled inline)
  sceneOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    opacity: 2, // optional: so it doesn’t overpower
  },

  content: {
    flex: 1,
  },

  navbar: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logo: { top:10, width: 40, height: 40, resizeMode: "contain" },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b7dceff",
    position: "relative",
    left: 45,
    bottom:25
  },
  banner: {
    padding: 20,
    top: 30,
    marginLeft:10,
    marginRight:10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  bannerText: { fontSize: 20, fontWeight: "bold", color: "#a90060", marginBottom: 10 },

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

