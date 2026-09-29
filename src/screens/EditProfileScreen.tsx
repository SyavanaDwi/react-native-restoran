import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { userAuthStore } from "../stores/authStore";
import api from "../services/api";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
  const { user, setUser } = userAuthStore();

  const [nama, setNama] = useState(user?.nama || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nama.trim() || !email.trim()) {
      Alert.alert("Peringatan", "Nama dan email wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const data: {
        nama: string;
        email: string;
        password?: string;
      } = {
        nama: nama.trim(),
        email: email.trim(),
      };

      if (password.trim()) {
        data.password = password;
      }

      const response = await api.put(`/user/${user?.id}`, data);

      if (response.data.data) {
        setUser(response.data.data);
      } else {
        setUser({
          id: user!.id,
          nama: nama.trim(),
          email: email.trim(),
          role: user!.role,
        });
      }

      setPassword("");

      Alert.alert("Berhasil", "Profile berhasil diperbarui.");
    } catch (error: any) {
      console.log("GAGAL UPDATE PROFILE:", error?.response?.data || error);

      Alert.alert(
        "Gagal",
        error?.response?.data?.message || "Profile gagal diperbarui.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9] ">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? "height" : "padding"}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center pt-3 pb-5">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-11 h-11 rounded-full bg-white items-center justify-center">
              <Ionicons
                name="arrow-back"
                size={23}
                color="#0A2947"
              />
            </Pressable>

            <View className="ml-4 flex-1">
              <Text className="text-2xl font-bold text-[#0A2947]">
                Edit Profile
              </Text>

              <Text className="text-[#8B5E3C] mt-1">
                Ubah informasi profile kamu
              </Text>
            </View>

            <View className="w-11 h-11 rounded-full bg-[#0A2947] items-center justify-center">
              <Ionicons
                name="person-outline"
                size={22}
                color="#F3E4C9"
              />
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6">
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-[#F3E4C9] items-center justify-center">
                <Ionicons
                  name="person"
                  size={38}
                  color="#8B5E3C"
                />
              </View>

              <Text className="text-[#0A2947] font-bold text-lg mt-3">
                {user?.nama || "User"}
              </Text>

              <Text className="text-gray-500 mt-1">
                {user?.role || "Staff"}
              </Text>
            </View>

            <View className="mb-5">
              <Text className="text-[#0A2947] font-semibold mb-2">Nama</Text>

              <View className="flex-row items-center border border-[#D3D4C0] rounded-xl px-4">
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#8B5E3C"
                />

                <TextInput
                  value={nama}
                  onChangeText={setNama}
                  placeholder="Masukkan nama"
                  placeholderTextColor="#999"
                  className="flex-1 ml-3 py-3 text-[#0A2947]"
                />
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-[#0A2947] font-semibold mb-2">Email</Text>

              <View className="flex-row items-center border border-[#D3D4C0] rounded-xl px-4">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#8B5E3C"
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Masukkan email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 py-3 text-[#0A2947]"
                />
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-[#0A2947] font-semibold mb-2">
                Password Baru
              </Text>

              <View className="flex-row items-center border border-[#D3D4C0] rounded-xl px-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8B5E3C"
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  placeholderTextColor="#999"
                  secureTextEntry
                  className="flex-1 ml-3 py-3 text-[#0A2947]"
                />
              </View>

              <Text className="text-gray-400 text-xs mt-2">
                Isi password hanya jika ingin mengganti password.
              </Text>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={loading}
              className="bg-[#0A2947] rounded-xl py-4 mt-6">
              <View className="flex-row items-center justify-center">
                {loading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />

                    <Text className="text-white font-bold ml-2">
                      Menyimpan...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="save-outline"
                      size={21}
                      color="#FFFFFF"
                    />

                    <Text className="text-white font-bold text-base ml-2">
                      Simpan Perubahan
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
