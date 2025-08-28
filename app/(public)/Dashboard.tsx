// screens/DashBoard.tsx
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { JSX, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [SceneComponent, setSceneComponent] = useState<JSX.Element | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // search + toggle
  const [search, setSearch] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);

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
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/all`);
        const data = await res.json();

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
            clerkId: u.clerkId || u.id,
          })
        );

        setAllUsers(formatted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ---------------- Filtering Logic ----------------
  const getFilteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Exclude logged-in user
      if (u.clerkId && loggedInUserClerkId && u.clerkId === loggedInUserClerkId)
        return false;

      return true;
    });
  }, [allUsers, loggedInUserClerkId]);

  const getDisplayUsers = useMemo(() => {
    const searchFiltered = getFilteredUsers.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
        (u.skills &&
          u.skills.some((skill) =>
            skill.toLowerCase().includes(search.toLowerCase())
          ))
    );

    if (search.trim()) {
      return searchFiltered;
    }

    if (!showAllUsers) {
      return searchFiltered.slice(0, 6);
    }

    return searchFiltered;
  }, [getFilteredUsers, search, showAllUsers]);

  const totalFilteredUsers = getFilteredUsers.length;
  const hasMoreUsers =
    !search.trim() && !showAllUsers && totalFilteredUsers > 6;

  // ---------------- UI ----------------
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

        {/* Enhanced Search Bar */}
        <View style={styles.searchWrapper}>
          <LinearGradient
            colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.searchGlow}
          />
          <BlurView intensity={40} tint="light" style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color="#2563eb"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Dive into your Skills"
              placeholderTextColor="#60a5fa"
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                if (text.trim()) setShowAllUsers(false);
              }}
              style={styles.searchInput}
            />
          </BlurView>
        </View>

        {/* Scrollable Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
            />
          ) : (
            <UserSection
              title="Popular Users"
              users={getDisplayUsers}
              onSeeAll={() => setShowAllUsers(!showAllUsers)}
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
      {selectedUser && selectedUser.clerkId && (
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

  // --- New Search Bar Styles ---
  searchWrapper: {
    alignItems: "center",
    marginBottom: 0,
    marginTop: 40,
    position: "relative",
  },
  searchGlow: {
    position: "absolute",
    width: "90%",
    maxWidth: 350,
    height: 55,
    borderRadius: 30,
    opacity: 0.35,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "90%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1e40af",
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
