import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileMenu from "../components/ProfileMenu";
import Footer from "../components/footer";

export default function MySessions() {
  const [activeTab, setActiveTab] = useState<"learning" | "teaching">("learning");

  return (

    <View style={styles.container1}>
        <View style={styles.navbar}>
                <TouchableOpacity>
                  <Image source={require("../../assets/images/skillSwap.png")} style={styles.logo} />
                  <Text style={styles.title1}>SkillSwap</Text>
                </TouchableOpacity>
                <ProfileMenu />
        </View>
        <View style={styles.separator} />
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>📘 My Sessions</Text>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "learning" && styles.activeTab
          ]}
          onPress={() => setActiveTab("learning")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "learning" && styles.activeTabText
            ]}
          >
            My Learning (1)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "teaching" && styles.activeTab
          ]}
          onPress={() => setActiveTab("teaching")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "teaching" && styles.activeTabText
            ]}
          >
            My Teaching (0)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === "learning" ? (
          <View style={styles.sessionBox}>
            <Text style={styles.sessionText}>You are learning React Native 🚀</Text>
          </View>
        ) : (
          <View style={styles.sessionBox}>
            <Text style={styles.sessionText}>
              No teaching sessions booked yet.
            </Text>
            <Text style={styles.subText}>
              Students will appear here when they book your sessions.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
     {/* Floating Icon */}
          <View style={styles.floatingIcon}>
            <Image source={require("../../assets/images/skillSwap.png")} style={styles.iconImage} />
          </View>
          {/* Footer */}
          <View style={styles.footer}>
            <Footer />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container1:{ flex:1,backgroundColor:"#f1f1f1" },
  container: { flex: 1, backgroundColor: "#f1f1f1", padding: 30 , top:10},
  header: { marginBottom: 20 },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#0056ff" },
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
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#28a745",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
    navbar: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  separator:{height: 1, backgroundColor: "#aeadadff", marginVertical: 6 , bottom:4},
  logo: { top:10, width: 40, height: 40, resizeMode: "contain" },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b7dceff",
    position: "relative",
    left: 45,
    bottom:25
  },
  activeTabText: {
    color: "#fff",
  },
  content: { flex: 1 },
  sessionBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  sessionText: { fontSize: 16, fontWeight: "500", color: "#333" },
  subText: { marginTop: 5, fontSize: 14, color: "#666", textAlign: "center" },
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
