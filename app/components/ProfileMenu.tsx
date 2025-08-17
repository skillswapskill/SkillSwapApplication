import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MENU_ITEMS = [
  { label: "Dashboard", route: "/(public)/Dashboard" },
  { label: "Profile", route: "/auth/profile" },
  { label: "Home", route: "/auth/home" },
  { label: "My Learning", route: "/auth/my-learning" },
  { label: "Redeem Credits", route: "/auth/redeem" },
];

export default function ProfileMenu() {
  const [visible, setVisible] = React.useState(false);
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser(); // 👈 gives you logged-in user info

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const onPressItem = (route?: string) => {
    close();
    if (route) router.push(route as any);
  };

  const onLogout = async () => {
    close();
    try {
      await signOut();
      router.replace("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <>
      {/* Avatar / button that opens the menu */}
      <TouchableOpacity onPress={open} style={styles.touchable}>
        <Image
          source={{
            uri:
              user?.imageUrl ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png", // fallback avatar
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* Modal menu */}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.overlay} onPress={close}>
          <View style={styles.menuContainer}>
            {MENU_ITEMS.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={styles.menuItem}
                onPress={() => onPressItem(m.route)}
              >
                <Text style={styles.menuText}>{m.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.separator} />

            <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  touchable: { paddingHorizontal: 6, paddingVertical: 4 },
  avatar: { width: 36, height: 36, borderRadius: 18 },

  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  menuContainer: {
    marginTop: 80,
    marginRight: 10,
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },

  menuItem: { paddingVertical: 10, paddingHorizontal: 8 },
  menuText: { fontSize: 16, color: "#222" },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 6 },
  logoutText: { color: "red" },
});
