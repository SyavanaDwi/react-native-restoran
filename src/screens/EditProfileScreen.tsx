import { View, Text, TextInput, Pressable } from "react-native";

import { useState, useEffect } from "react";

import { userAuthStore } from "../stores/authStore";

export default function EditProfileScreen() {
  const user = userAuthStore((state) => state.user);

  const [nama, setNama] = useState(user?.nama || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      console.log("nama baru:", nama);
      console.log("email baru:", email);
    } catch (error) {
      console.log("Gagal mengupdate profile", error);
    } finally {
      setLoading(false);
    }
  };
}
