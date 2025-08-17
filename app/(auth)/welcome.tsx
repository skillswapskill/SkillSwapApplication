import { useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileMenu from "../components/ProfileMenu";
import Footer from '../components/footer';

export default function HomeScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [background,setBackground]=useState("");

  const goToNext = () => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.push('/Dashboard');//This is the line  to fix
    } else {
      router.push('/login');
    }
  };

    const openLink = async (url: string) => {
      try {
        await Linking.openURL(url);
      } catch (err) {
        console.error("Failed to open link:", err);
      }
    };

      useEffect(() => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) {
          setBackground("#ecf5b7ff");
        } else if (hours >= 12 && hours < 18){

          setBackground("#edb7f5ff");
        } else {
          setBackground("#b7d5f5ff");
        }
      }, []);


  return (
    <LinearGradient
      colors={['#f9fafb', background]} // You can adjust to match the light gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Top Navbar */}
        <View style={styles.navbar}>
          <Image source={require("../../assets/images/skillSwap.png")} style={styles.logo} />
          <Text style={styles.title1}>SkillSwap</Text>
          <ProfileMenu />
        </View>

        {/* Main Tagline */}
        <View style={styles.tagline}>
          <Text style={styles.titletag}>Trade Skills</Text>
          <Text style={styles.titletag}>Not bills</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>SkillSwap</Text>
          <Text style={styles.subtitle}>
            SkillSwap is where talent meets opportunity — exchange skills, build dreams, and grow together.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryBtn} onPress={goToNext}>
              <Text style={styles.primaryText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Icon */}
        <TouchableOpacity style={styles.floatingIcon} onPress={()=>openLink("https://skillswap.company/")}>
          <Image source={require("../../assets/images/skillSwap.png")} style={styles.iconImage} />
        </TouchableOpacity>

        <View style={styles.footer}>
            <Footer />
        </View>
      </View>
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  tagline: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    top: 120,
    alignItems: "center",
  },
  titletag: {
    fontSize: 50,
    fontWeight: "500",
    color: "#063d7cff"
  },
  content: {
    flex: 5,
    justifyContent: "center",
    top:50,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b7dceff",
    position: "relative",
    right: 90
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: "80%",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "80%",
  },
  secondaryText: {
    color: "#007BFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  floatingIcon: {
    position: "absolute",
    bottom: 50,
    left: 20,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  footer:{
    bottom:30
  }
});
