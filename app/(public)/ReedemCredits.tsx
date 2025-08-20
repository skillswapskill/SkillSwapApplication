import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ProfileMenu from "../components/ProfileMenu";
import Footer from "../components/footer";

export default function ReedemCredits() {
  const [credits, setCredits] = useState(250); // example balance
  const [skillCoins, setSkillCoins] = useState(0);
  const [redeemAmount, setRedeemAmount] = useState("");

  const conversionRate = 1000; // 1000 credits = 1 SkillCoin

  const handleMax = () => {
    setRedeemAmount(credits.toString());
  };

  const handleRedeem = () => {
    const amount = parseInt(redeemAmount, 10);
    if (amount >= conversionRate && amount <= credits) {
      const coins = Math.floor(amount / conversionRate);
      setSkillCoins(skillCoins + coins);
      setCredits(credits - coins * conversionRate);
      setRedeemAmount("");
    }
  };

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
   <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Redeem Info */}
      <View style={styles.card}>
        <Text style={styles.title}>🪙 Redeem Your Credits</Text>
        <Text style={styles.text}>
          Convert your hard-earned credits into <Text style={{ fontWeight: "bold" }}>SkillCoins!</Text>
        </Text>
      </View>

      {/* Balance */}
      <View style={styles.card}>
        <Text style={styles.title}>💰 Your Balance</Text>
        <View style={styles.row}>
          <View style={styles.balanceBox}>
            <Text style={styles.label}>Available Credits</Text>
            <Text style={styles.creditText}>{credits}</Text>
          </View>
          <View style={[styles.balanceBox, { backgroundColor: "#E6FCE6" }]}>
            <Text style={styles.label}>SkillCoins</Text>
            <Text style={[styles.creditText, { color: "green" }]}>{skillCoins}</Text>
          </View>
        </View>
      </View>

      {/* Convert Credits */}
      <View style={styles.card}>
        <Text style={styles.title}>🔄 Convert Credits</Text>
        <Text style={styles.rate}>
          {conversionRate.toLocaleString()} Credits = 1 SkillCoin
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Minimum 1000 credits"
            value={redeemAmount}
            onChangeText={setRedeemAmount}
          />
          <TouchableOpacity style={styles.outlineButton} onPress={handleMax}>
            <Text style={styles.outlineButtonText}>Max</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: parseInt(redeemAmount, 10) >= conversionRate ? "#2563EB" : "gray" },
          ]}
          disabled={parseInt(redeemAmount, 10) < conversionRate}
          onPress={handleRedeem}
        >
          <Text style={styles.buttonText}>Redeem Credits</Text>
        </TouchableOpacity>
      </View>

      {/* About SkillCoins */}
      <View style={styles.card}>
        <Text style={styles.title}>ℹ️ About SkillCoins</Text>
        <View style={styles.info}>
          <Text style={styles.infoTitle}>🚀 Upcoming Launch</Text>
          <Text style={styles.infoText}>SkillCoins will be launched soon with exclusive features.</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.infoTitle, { color: "green" }]}>💎 Premium Currency</Text>
          <Text style={styles.infoText}>Access exclusive content, booking, and rewards.</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.infoTitle, { color: "purple" }]}>🔒 Secure & Safe</Text>
          <Text style={styles.infoText}>Your SkillCoins are safely stored in your account.</Text>
        </View>
      </View>
      {/* Floating Icon */}
              <View style={styles.floatingIcon}>
                <Image source={require("../../assets/images/skillSwap.png")} style={styles.iconImage} />
              </View>
              {/* Footer */}
              <View style={styles.footer}>
                <Footer />
        </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container1:{ flex:1 },
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
  container: { padding: 16 , backgroundColor: "#f1f1f1" },
  card: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  title: { fontSize: 18, fontWeight: "bold", color: "#2563EB", marginBottom: 8 },
  text: { fontSize: 14, color: "#4B5563" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  balanceBox: { flex: 1, margin: 4, backgroundColor: "#E0F2FE", padding: 12, borderRadius: 10, alignItems: "center" },
  label: { color: "#6B7280" },
  creditText: { fontSize: 20, fontWeight: "bold", color: "#2563EB" },
  rate: { textAlign: "center", padding: 8, backgroundColor: "#34D399", borderRadius: 10, color: "white", fontWeight: "bold", marginVertical: 8 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, padding: 10, marginRight: 8 },
  outlineButton: { borderWidth: 1, borderColor: "#2563EB", borderRadius: 10, padding: 10 },
  outlineButtonText: { color: "#2563EB", fontWeight: "bold" },
  button: { padding: 14, borderRadius: 10, marginTop: 8 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  info: { marginTop: 10 },
  infoTitle: { fontWeight: "bold", color: "#2563EB" },
  infoText: { color: "#4B5563", fontSize: 12 },
   floatingIcon: {
    position: "absolute",
    bottom: 50,
    left: 20,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  iconImage: { width: 24, height: 24 },
  footer: { bottom: 10},
});
