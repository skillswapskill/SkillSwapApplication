import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { JSX, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import ProfileMenu from "../components/ProfileMenu";
import Footer from "../components/footer";

import type { OAuthStrategy } from "@clerk/types";

const socialProviders: { name: string; strategy: OAuthStrategy; icon: JSX.Element }[] = [
  { name: "Apple", strategy: "oauth_apple", icon: <AntDesign name="apple1" size={24} color="black" /> },
  { name: "GitHub", strategy: "oauth_github", icon: <AntDesign name="github" size={24} color="black" /> },
  { name: "Google", strategy: "oauth_google", icon: <AntDesign name="google" size={24} color="#DB4437" /> },
  { name: "LinkedIn", strategy: "oauth_linkedin", icon: <AntDesign name="linkedin-square" size={24} color="#0077B5" /> },
];

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const startOAuth = (strategy: OAuthStrategy) => {
    const { startOAuthFlow } = useOAuth({ strategy });
    return async () => {
      setLoading(true);
      try {
        const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow();
        if (createdSessionId && typeof setOAuthActive === "function") {
          await setOAuthActive({ session: createdSessionId });
        }
      } catch (err) {
        console.error(`${strategy} OAuth error:`, err);
        alert(`${strategy} sign-in failed`);
      } finally {
        setLoading(false);
      }
    };
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      console.error(err);
      if (typeof err === "object" && err !== null && "errors" in err && Array.isArray((err as any).errors)) {
        alert((err as any).errors[0]?.message || "Sign-in failed");
      } else {
        alert("Sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
          colors={['#f9fafb', '#b7d5f5ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
    >
    <View style={styles.container}>
      <Spinner visible={loading} />
      <View style={styles.navbar}>
              <Image source={require("../../assets/images/skillSwap.png")} style={styles.logo} />
              <ProfileMenu />
      </View>

      <View style={styles.main}>

      <Text style={styles.title}>Log in to SkillSwap</Text>
      <Text style={styles.subtitle}>Welcome back! Please log in to continue</Text>

      <TextInput
        autoCapitalize="none"
        placeholder="Email address"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.inputField}
        editable={!loading}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
        editable={!loading}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress} disabled={loading}>
        <Text style={styles.primaryButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {socialProviders.map((p) => (
        <TouchableOpacity key={p.strategy} style={styles.socialButton} onPress={startOAuth(p.strategy)}>
          <View style={styles.icon}>{p.icon}</View>
          <Text style={styles.socialText}>Continue with {p.name}</Text>
        </TouchableOpacity>
      ))}

      <Link href="/register" asChild>
        <TouchableOpacity style={{ marginTop: 15, alignItems: "center" }}>
          <Text style={{ color: "#6c47ff" }}>Create Account</Text>
        </TouchableOpacity>
      </Link>
      </View>
      <TouchableOpacity style={styles.floatingIcon}>
                      <Image source={require("../../assets/images/skillSwap.png")} style={styles.iconImage} />
      </TouchableOpacity>
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 16, color: "#666" },
  background:{
    flex:1
  },
  navbar: {
    flexDirection: "row",
    position:"relative",
    bottom:0,
    justifyContent: "space-between",
    alignItems: "center",
  },
   main:{
    top:30
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  inputField: {
    marginVertical: 6,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  primaryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
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
  iconImage: {
    width: 24,
    height: 24,
  },
  primaryButtonText: { color: "#fff", fontWeight: "bold" },
  orText: { textAlign: "center", color: "#888", marginVertical: 10 },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  icon: { marginRight: 10 },
  socialText: { fontSize: 16 },
  footer:{
    top:20
  }
});

export default Login;
