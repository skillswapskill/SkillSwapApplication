import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { OAuthStrategy } from "@clerk/types";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { JSX, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import ProfileMenu from "../components/ProfileMenu";
import Footer from "../components/footer";

WebBrowser.maybeCompleteAuthSession();

const socialProviders: { name: string; strategy: OAuthStrategy; icon: JSX.Element }[] = [
  { name: "Apple", strategy: "oauth_apple", icon: <AntDesign name="apple1" size={24} color="black" /> },
  { name: "GitHub", strategy: "oauth_github", icon: <AntDesign name="github" size={24} color="black" /> },
  { name: "Google", strategy: "oauth_google", icon: <AntDesign name="google" size={24} color="#DB4437" /> },
  { name: "LinkedIn", strategy: "oauth_linkedin", icon: <AntDesign name="linkedin-square" size={24} color="#0077B5" /> },
];

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  interface OAuthFlowResult {
    createdSessionId?: string;
    setActive?: (params: { session: string }) => Promise<void>;
  }
  type StartOAuth = (strategy: OAuthStrategy) => () => Promise<void>;

  const startOAuth: StartOAuth = (strategy) => {
    const { startOAuthFlow } = useOAuth({ strategy });
    return async (): Promise<void> => {
      setLoading(true);
      try {
        const { createdSessionId, setActive: setOAuthActive }: OAuthFlowResult = await startOAuthFlow();
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

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
      if (err && typeof err === "object" && "errors" in err && Array.isArray((err as any).errors)) {
        alert((err as any).errors[0]?.message || "Sign-up failed");
      } else {
        alert("Sign-up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      console.error(err);
      if (err && typeof err === "object" && "errors" in err && Array.isArray((err as any).errors)) {
        alert((err as any).errors[0]?.message || "Verification failed");
      } else {
        alert("Verification failed");
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
      <Stack.Screen options={{ headerBackVisible: !pendingVerification, title: "Sign In" }} />
      <Spinner visible={loading} />

      <View style={styles.navbar}>
                    <Image source={require("../../assets/images/skillSwap.png")} style={styles.logo} />
                    <ProfileMenu />
      </View>

      {!pendingVerification ? (
        <View style={styles.main}>
          <Text style={styles.title}>Sign in to SkillSwap</Text>
          <Text style={styles.subtitle}>Welcome! Please sign in to continue</Text>

          <TextInput
            autoCapitalize="none"
            placeholder="Email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
            <Text style={styles.primaryButtonText}>Sign up</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          {socialProviders.map((p) => (
            <TouchableOpacity key={p.strategy} style={styles.socialButton} onPress={startOAuth(p.strategy)}>
              <View style={styles.icon}>{p.icon}</View>
              <Text style={styles.socialText}>Continue with {p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <>
          <Text style={styles.title}>Verify Email</Text>
          <TextInput
            value={code}
            placeholder="Verification code"
            style={styles.inputField}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={onPressVerify}>
            <Text style={styles.primaryButtonText}>Verify Email</Text>
          </TouchableOpacity>
        </>
      )}
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
  container: { flex: 1, justifyContent: "center", padding: 20},
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 16, color: "#666" },
  background:{
    flex:1
  },
  main:{
    top:22
  },
  navbar: {
    flexDirection: "row",
    position:"relative",
    bottom:0,
    justifyContent: "space-between",
    alignItems: "center",
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
  primaryButtonText: { color: "#fff", fontWeight: "bold" },
  orText: { textAlign: "center", color: "#888", marginVertical: 10 },
  floatingIcon: {
    position: "absolute",
    bottom: 40,
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
    top:30
  }
});

export default Register;
