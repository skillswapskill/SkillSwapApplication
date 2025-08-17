import { AntDesign, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Footer() {
  const [emailAddress, setEmailAddress] = useState("");

  const links = [
    { name: "facebook", url: "https://facebook.com/SkillSwap" },
    { name: "twitter", url: "https://twitter.com/SkillSwap" },
    { name: "linkedin", url: "https://linkedin.com/company/SkillSwap" },
    { name: "youtube", url: "https://youtube.com/@SkillSwap" },
    { name: "instagram", url: "https://instagram.com/SkillSwap" },
  ];


  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error("Failed to open link:", err);
    }
  };

  return (
    <View style={{ alignItems: "center", padding: 20 }}>
      <Text style={styles.heading}>Reset the primitive approach of learning Skills</Text>
      <Text style={styles.subheading}>Stay up to date</Text>

      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={emailAddress}
          onChangeText={setEmailAddress}
          style={styles.inputField}
        />
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>Subscribe</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>
        © 2025 SkillSwap All rights reserved.
      </Text>

      <View style={styles.socialContainer}>
        {links.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.iconContainer}
            onPress={() => openLink(item.url)}
          >
            {item.name === "facebook" && <FontAwesome name="facebook" size={20} color="#1877F2" />}
            {item.name === "twitter" && <AntDesign name="twitter" size={20} color="#1DA1F2" />}
            {item.name === "linkedin" && <AntDesign name="linkedin-square" size={20} color="#0077B5" />}
            {item.name === "youtube" && <AntDesign name="youtube" size={20} color="#FF0000" />}
            {item.name === "instagram" && <AntDesign name="instagram" size={20} color="#C13584" />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    bottom:12,
    overflow: "hidden",
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 350,
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  subscribeButton: {
    backgroundColor: "#007BFF",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "500",
  },
  copyright: {
    fontSize: 12,
    color: "#777",
    marginTop: 20,
    marginBottom: 15,
  },
  socialContainer: {
    marginLeft:50,
    flexDirection: "row",
    justifyContent: "center",
  },
  iconContainer: {
    marginHorizontal: 6,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 50,
    padding: 10,
  },
});
