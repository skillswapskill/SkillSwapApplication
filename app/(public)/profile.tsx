// screens/ProfileDashboard.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ProfileDashboard() {
  const [credits, setCredits] = useState(300);
  const [serviceName, setServiceName] = useState("");
  const [creditRequired, setCreditRequired] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddService = () => {
    console.log("Service Added:", serviceName, creditRequired, date);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.card}>
        <Image
          source={{ uri: "https://placehold.co/100x100" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Sagar Paul</Text>
        <Text style={styles.role}>Android Dev</Text>

        {/* Credits Section */}
        <LinearGradient colors={["#f9fafb", "#e0f7fa"]} style={styles.creditBox}>
          <Text style={styles.creditTitle}>Credits</Text>
          <Text style={styles.creditValue}>{credits}</Text>

          <TouchableOpacity style={styles.buyButton}>
            <LinearGradient
              colors={["#ff416c", "#ff4b2b"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>💳 Buy Credits</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buyButton, { marginTop: 10 }]}
            disabled={credits < 1000}
          >
            <LinearGradient
              colors={["#6a11cb", "#2575fc"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>🪙 Redeem Credits</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.redeemNote}>
            Minimum 1,000 credits required to redeem
          </Text>
        </LinearGradient>

        <TouchableOpacity>
          <Text style={styles.editProfile}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Sessions Section */}
      <View style={styles.card}>
        <Text style={styles.sessionTitle}>📋 My Sessions</Text>
        <Text style={styles.noSession}>No session listed yet.</Text>

        <TextInput
          style={styles.input}
          placeholder="Service name"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0056ff",
  },
  role: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#e0eaff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 15,
  },
  creditBox: {
    width: "100%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 15,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0056ff",
  },
  creditValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    marginVertical: 10,
  },
  buyButton: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  redeemNote: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
  },
  editProfile: {
    marginTop: 10,
    color: "#0056ff",
    fontWeight: "bold",
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0056ff",
    marginBottom: 5,
  },
  noSession: {
    color: "#888",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    width: "100%",
    backgroundColor: "#0056ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
