import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert, Image, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import ProfileMenu from "../components/ProfileMenu";
import Footer from "../components/footer";
import apiClient from "../config/apiClient";

export default function RedeemCredits() {
  const { user, isSignedIn } = useUser();

  const [credits, setCredits] = useState(0);
  const [skillCoins, setSkillCoins] = useState(0);
  const [creditsToRedeem, setCreditsToRedeem] = useState("");
  const [mongoUserId, setMongoUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conversionRate = 1000;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isSignedIn) return;
      try {
        const res = await apiClient.post("/api/users/sync", {
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        });
        const data = res.data;
        setCredits(data.totalCredits || 0);
        setSkillCoins(data.skillCoins || 0);
        setMongoUserId(data._id);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        Alert.alert("Error", "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [isSignedIn]);

  const handleMax = () => {
    const maxRedeemable = Math.floor(credits / conversionRate) * conversionRate;
    setCreditsToRedeem(maxRedeemable.toString());
  };

  const handleRedeem = async () => {
    const redeemAmount = parseInt(creditsToRedeem, 10);

    if (!redeemAmount || redeemAmount < conversionRate) {
      Alert.alert("Error", `Minimum ${conversionRate} credits required to redeem.`);
      return;
    }
    if (redeemAmount > credits) {
      Alert.alert("Error", "Insufficient credits.");
      return;
    }

    const coinsToReceive = Math.floor(redeemAmount / conversionRate);
    const creditsToDeduct = coinsToReceive * conversionRate;

    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/api/credits/redeem", {
        userId: mongoUserId,
        creditsToRedeem: creditsToDeduct,
        skillCoinsToReceive: coinsToReceive,
      });

      if (response.status === 200) {
        setCredits((prev) => prev - creditsToDeduct);
        setSkillCoins((prev) => prev + coinsToReceive);
        setCreditsToRedeem("");
        Alert.alert("Success", `Redeemed ${creditsToDeduct} credits for ${coinsToReceive} SkillCoin(s)!`);
      }
    } catch (err) {
      console.error("Redemption failed", err);
      Alert.alert("Error", "Redemption failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <View style={styles.centered}>
        <Text style={styles.info}>🔐 Please sign in to redeem your credits</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container1}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Image source={require("../../assets/images/skillSwap.png")} style={styles.logo} />
          <Text style={styles.title1}>SkillSwap</Text>
        </TouchableOpacity>
        <ProfileMenu />
      </View>
      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Balance */}
        <View style={styles.card}>
          <Text style={styles.title}>💰 Your Balance</Text>
          <Text>Credits: {credits.toLocaleString()}</Text>
          <Text>SkillCoins: {skillCoins}</Text>
        </View>

        {/* Convert Credits */}
        <View style={styles.card}>
          <Text style={styles.title}>🔄 Convert Credits</Text>
          <Text>{conversionRate} Credits = 1 SkillCoin</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={creditsToRedeem}
              onChangeText={setCreditsToRedeem}
              placeholder="Enter credits"
            />
            <TouchableOpacity style={styles.outlineButton} onPress={handleMax}>
              <Text style={styles.outlineButtonText}>Max</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isSubmitting ? "gray" : "#2563EB" },
            ]}
            onPress={handleRedeem}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Processing..." : "Redeem"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.title}>ℹ️ About SkillCoins</Text>
          <Text>🚀 Premium currency coming soon!</Text>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  navbar: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  separator: { height: 1, backgroundColor: "#ccc", marginVertical: 6 },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  title1: { fontSize: 20, fontWeight: "bold", color: "#3b7dceff" },
  info: { marginTop: 10 },
  container: { padding: 16, backgroundColor: "#f1f1f1" },
  card: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  inputRow: { flexDirection: "row", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  outlineButton: { padding: 10, backgroundColor: "#eee", borderRadius: 8, marginLeft: 8 },
  outlineButtonText: { fontWeight: "bold" },
  button: { marginTop: 12, padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
});

