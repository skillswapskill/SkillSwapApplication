// app/(tabs)/profile.tsx or wherever your screen lives
import { useAuth, useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ProfileMenu from "../components/ProfileMenu";
import Footer from "../components/footer";

type OfferedSession = {
  _id: string;
  skill: string;
  creditsUsed: number;
  dateTime: string; // ISO
};

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://10.0.2.2:3000";

export default function ProfileDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // --- Profile state
  const [name, setName] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState<string>("");
  const [profilePicUri, setProfilePicUri] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [mongoUserId, setMongoUserId] = useState<string>("");

  // --- Sessions state
  const [services, setServices] = useState<OfferedSession[]>([]);
  const [serviceName, setServiceName] = useState<string>("");
  const [creditRequired, setCreditRequired] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // --- Edit state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("Your Name");
  const [tempPicUri, setTempPicUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Helpers
  const authHeaders = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const showErr = (msg: string) => Alert.alert("Error", msg);

  // 1) Sync user & load profile
  useEffect(() => {
    (async () => {
      try {
        if (!user) return;
        const headers = await authHeaders();

        const res = await fetch(`${API_BASE}/api/users/sync`, {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
          }),
        });

        if (!res.ok) {
          console.error("Sync failed", await safeText(res));
          return;
        }

        const data = await res.json();
        setCredits(Number(data.totalCredits || 0));
        setName(String(data.name || user.fullName || ""));
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        setMongoUserId(String(data._id || ""));
        if (data.profilePic) setProfilePicUri(String(data.profilePic));
        setTempName(String(data.name || user.fullName || ""));
        setTempPicUri(data.profilePic || null);

        if (data._id) {
          await fetchOfferedServices(String(data._id));
        }
      } catch (e: any) {
        console.error("Sync error", e?.message || e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 2) Fetch Offered Sessions
  const fetchOfferedServices = async (userId: string) => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/api/sessions/offered/${userId}`, {
        method: "GET",
        headers,
      });
      if (!res.ok) {
        console.error("Fetch sessions failed", await safeText(res));
        return;
      }
      const sessions: any[] = await res.json();
      const formatted: OfferedSession[] = sessions.map((s) => ({
        _id: s._id,
        skill: s.skill,
        creditsUsed: s.creditsUsed,
        dateTime: s.dateTime,
      }));
      setServices(formatted);
    } catch (e: any) {
      console.error("Fetch sessions error", e?.message || e);
    }
  };

  // Image Picker for Profile Photo
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "We need access to your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (uri) {
        setTempPicUri(uri);
      }
    }
  };

  // Upload profile picture (multipart) -> returns URL or null
  const uploadProfilePic = async (): Promise<string | null> => {
    if (!tempPicUri || !user?.id) return null;
    setUploading(true);
    try {
      const headers = await authHeaders();
      const form = new FormData();
      form.append("clerkId", user.id);
      // @ts-expect-error React Native FormData file
      form.append("profilePic", {
        uri: tempPicUri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const res = await fetch(`${API_BASE}/api/users/upload-profile-pic`, {
        method: "POST",
        headers: {
          ...headers,
          // NOTE: DO NOT set Content-Type; RN will set proper multipart boundary
        } as any,
        body: form as any,
      });

      if (!res.ok) {
        console.error("Upload failed", await safeText(res));
        showErr("Failed to upload profile picture");
        return null;
      }
      const data = await res.json();
      return data.profilePic || null;
    } catch (e: any) {
      console.error("Upload error", e?.message || e);
      showErr("Failed to upload profile picture");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Save Profile (setup-complete)
  const handleSaveProfile = async () => {
    try {
      let finalPic = profilePicUri;
      // if user changed image, upload it
      if (tempPicUri && tempPicUri !== profilePicUri) {
        const uploaded = await uploadProfilePic();
        if (uploaded) finalPic = uploaded;
      }
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/api/users/setup-complete`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user?.id,
          name: tempName?.trim() || name,
          skills,
          profilePic: finalPic,
        }),
      });
      if (!res.ok) {
        console.error("Save profile failed", await safeText(res));
        showErr("Failed to save profile");
        return;
      }
      setName(tempName?.trim() || name);
      setProfilePicUri(finalPic || null);
      setIsEditing(false);
    } catch (e: any) {
      console.error("Save profile error", e?.message || e);
      showErr("Failed to save profile");
    }
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setTempPicUri(profilePicUri);
    setIsEditing(false);
  };

  // Skills add/remove
  const addSkill = () => {
    const s = inputSkill.trim();
    if (!s) return;
    if (skills.some((k) => k.toLowerCase() === s.toLowerCase())) {
      Alert.alert("Duplicate", "Skill already added.");
      return;
    }
    setSkills((prev) => [...prev, s]);
    setInputSkill("");
  };
  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Add Service
  const handleAddService = async () => {
    try {
      const sName = serviceName.trim();
      const creditsNum = parseInt(creditRequired || "0", 10);
      if (!mongoUserId) return showErr("User not synced yet.");
      if (!sName) return showErr("Please enter a service name.");
      // enforce: service name must be one of your skills (like web)
      if (!skills.map((x) => x.toLowerCase().trim()).includes(sName.toLowerCase())) {
        return showErr("Service name must match one of your skills.");
      }
      if (!Number.isFinite(creditsNum) || creditsNum <= 0) {
        return showErr("Please enter a valid credit amount.");
      }

      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/api/sessions/offer`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher: mongoUserId,
          skill: sName,
          creditsUsed: creditsNum,
          dateTime: new Date(date).toISOString(),
        }),
      });

      if (!res.ok) {
        console.error("Add service failed", await safeText(res));
        showErr("Failed to add service");
        return;
      }

      // Optimistically add to local list
      const created = await res.json();
      setServices((prev) => [
        ...prev,
        {
          _id: created._id || Math.random().toString(36),
          skill: created.skill || sName,
          creditsUsed: created.creditsUsed || creditsNum,
          dateTime: created.dateTime || new Date(date).toISOString(),
        },
      ]);

      setServiceName("");
      setCreditRequired("");
      setDate(new Date());
      Alert.alert("Success", "Service added successfully!");
    } catch (e: any) {
      console.error("Add service error", e?.message || e);
      showErr("Failed to add service");
    }
  };

  // Delete Service
  const handleDeleteService = async (sessionId: string) => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/api/sessions/delete/${sessionId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        console.error("Delete failed", await safeText(res));
        showErr("Failed to delete service");
        return;
      }
      setServices((prev) => prev.filter((s) => s._id !== sessionId));
      Alert.alert("Deleted", "Service deleted successfully!");
    } catch (e: any) {
      console.error("Delete error", e?.message || e);
      showErr("Failed to delete service");
    }
  };

  // Navigation
  const goPayment = () => router.push("/(auth)/welcome");
  const goRedeem = () => router.push("/(auth)/welcome");

  return (
    <View style={styles.container1}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/welcome")}>
          <Image
            source={require("../../assets/images/skillSwap.png")}
            style={styles.logo}
          />
          <Text style={styles.title1}>SkillSwap</Text>
        </TouchableOpacity>
        <ProfileMenu />
      </View>
      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={isEditing ? handlePickImage : undefined}
            disabled={!isEditing}
          >
            <Image
              source={
                (isEditing ? tempPicUri : profilePicUri)
                  ? { uri: (isEditing ? tempPicUri : profilePicUri)! }
                  : require("../../assets/images/user.png")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>

          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter your name"
              />

              {/* Skills Editor */}
              <View style={{ width: "100%", marginTop: 6 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Skills</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {skills.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => removeSkill(s)}
                      style={{
                        backgroundColor: "#e0eaff",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 16,
                        marginRight: 6,
                        marginBottom: 6,
                      }}
                    >
                      <Text style={{ color: "#0056ff" }}>{s} ✕</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Add a skill (e.g. React)"
                    value={inputSkill}
                    onChangeText={setInputSkill}
                    onSubmitEditing={addSkill}
                  />
                  <TouchableOpacity onPress={addSkill} style={styles.addSmallBtn}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.name}>{name || "Your Name"}</Text>
              {/* Skills read-only */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {skills.length === 0 ? (
                  <Text style={{ color: "#666" }}>No skills added.</Text>
                ) : (
                  skills.map((s) => (
                    <View
                      key={s}
                      style={{
                        backgroundColor: "#e0eaff",
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        borderRadius: 10,
                        marginRight: 6,
                        marginBottom: 6,
                      }}
                    >
                      <Text style={{ color: "#0056ff" }}>{s}</Text>
                    </View>
                  ))
                )}
              </View>
            </>
          )}

          {/* Credits */}
          <LinearGradient colors={["#f9fafb", "#e0f7fa"]} style={styles.creditBox}>
            <Text style={styles.creditTitle}>Credits</Text>
            <Text style={styles.creditValue}>{credits}</Text>

            <TouchableOpacity style={styles.buyButton} onPress={goPayment}>
              <LinearGradient colors={["#ff416c", "#ff4b2b"]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>💳 Buy Credits</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buyButton, { marginTop: 10 }]}
              onPress={goRedeem}
              disabled={credits < 1000}
            >
              <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>🪙 Redeem Credits</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.redeemNote}>
              Minimum 1,000 credits required to redeem
            </Text>
          </LinearGradient>

          {/* Edit Profile */}
          {isEditing ? (
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "green" }]}
                onPress={handleSaveProfile}
                disabled={uploading}
              >
                <Text style={styles.actionButtonText}>
                  {uploading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "red" }]}
                onPress={handleCancelEdit}
                disabled={uploading}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editProfile}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sessions */}
        <View style={styles.card}>
          <Text style={styles.sessionTitle}>📋 My Sessions</Text>

          {services.length === 0 ? (
            <Text style={styles.noSession}>No session listed yet.</Text>
          ) : (
            <View style={{ width: "100%", gap: 10 }}>
              {services.map((svc) => (
                <View
                  key={svc._id}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                    padding: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold", color: "#0056ff" }}>
                      {svc.skill}
                    </Text>
                    <Text style={{ color: "green" }}>
                      Credits Required: <Text style={{ fontWeight: "bold" }}>{svc.creditsUsed}</Text>
                    </Text>
                    <Text style={{ color: "#555" }}>
                      Time: {new Date(svc.dateTime).toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteService(svc._id)}>
                    <Text style={{ color: "red" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Service name (must match one of your skills)"
            value={serviceName}
            onChangeText={setServiceName}
          />
          <TextInput
            style={styles.input}
            placeholder="Credit required"
            value={creditRequired}
            onChangeText={setCreditRequired}
            keyboardType="numeric"
          />

          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{date.toLocaleString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity onPress={handleAddService} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Service</Text>
          </TouchableOpacity>
        </View>

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
      </ScrollView>
    </View>
  );
}

// Small helpers
async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

const styles = StyleSheet.create({
  container1: { flex: 1 },
  navbar: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  separator: { height: 1, backgroundColor: "#aeadadff", marginVertical: 6, bottom: 4 },
  logo: { top: 10, width: 40, height: 40, resizeMode: "contain" },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b7dceff",
    position: "relative",
    left: 45,
    bottom: 25,
  },
  container: {
    padding:30,
    bottom: 0,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold", color: "#0056ff" },
  creditBox: {
    width: "100%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 15,
  },
  creditTitle: { fontSize: 16, fontWeight: "bold", color: "#0056ff" },
  creditValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    marginVertical: 10,
  },
  buyButton: { width: "100%", borderRadius: 25, overflow: "hidden" },
  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  redeemNote: { fontSize: 12, color: "#555", marginTop: 8 },
  editProfile: { marginTop: 10, color: "#0056ff", fontWeight: "bold" },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  actionButtonText: { color: "#fff", fontWeight: "bold" },
  sessionTitle: { fontSize: 18, fontWeight: "bold", color: "#0056ff", marginBottom: 5 },
  noSession: { color: "#888", marginBottom: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addSmallBtn: {
    backgroundColor: "#0056ff",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  addButton: {
    width: "100%",
    backgroundColor: "#0056ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  floatingIcon: {
    position: "absolute",
    bottom: 55,
    left: 20,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  iconImage: { width: 24, height: 24 },
  footer: {bottom:0},
});
