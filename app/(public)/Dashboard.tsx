// screens/DashBoard.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { JSX, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Footer from "../components/footer";
import ProfileMenu from "../components/ProfileMenu";
import {
  AfternoonScene,
  EveningScene,
  MorningScene,
  NightScene,
} from "../components/Scenes";
import TreeCounter from "../components/TreeCounter";
import { User } from "../components/types";
import UserProfileModal from "../components/UserProfileModal";
import UserSection from "../components/UserSection";

// ✅ Import Clerk hooks
import { useUser } from "@clerk/clerk-react";

export default function DashBoard() {
  const [greeting, setGreeting] = useState("");
  const [background, setBackground] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [SceneComponent, setSceneComponent] = useState<JSX.Element | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const { user } = useUser(); // ✅ Get logged-in Clerk user
  const loggedInUserClerkId = user?.id;

  const welcomeOpen = () => {
    router.push("/welcome");
  };

  useEffect(() => {
    // Greeting + Scene
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

    // Fetch Users
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://skillswap.company/api/users/all");
        const data = await res.json();

        // Map API data to User type
        const formatted: User[] = data.users.map(
          (u: {
            id: string;
            name: string;
            profilePic: string;
            skills: string[];
            clerkId?: string;
          }) => ({
            id: u.id,
            name: u.name,
            image:
              u.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            skills: u.skills || ["No skills added"],
            clerkId: u.clerkId,
          })
        );

        // ✅ Filter out the logged-in user by Clerk ID
        const filtered = formatted.filter(
          (u) => u.clerkId !== loggedInUserClerkId
        );

        setUsers(filtered);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUserClerkId]);

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={["#f9fafb", background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.sceneOverlay}>{SceneComponent}</View>

      {/* Main Content */}
      <View style={styles.content}>
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

        {/* Greeting */}
        <LinearGradient
          colors={["#d8e6ff", "#c5c3f3ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <Text style={styles.bannerText}>
            {greeting}, {user?.fullName || "Sagar"}
          </Text>
        </LinearGradient>

        {/* Scrollable Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={{ marginTop: 20 }}
            />
          ) : (
            <UserSection
              title="Popular Users"
              users={users}
              onSeeAll={() => console.log("See All Popular Users")}
              onUserPress={(user) => setSelectedUser(user)}
            />
          )}
        </ScrollView>

        <TreeCounter />

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

      {/* Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sceneOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    opacity: 2,
  },
  content: { flex: 1 },
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
  banner: {
    padding: 20,
    top: 30,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a90060",
    marginBottom: 10,
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
  footer: { bottom: 10 },
});
