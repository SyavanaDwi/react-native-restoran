import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../services/api";

export default function CreatePelangganScreen() {
  const [nama, setNama] = useState("");
  const [nomerHp, setNomerHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nama || !nomerHp || !alamat) {
      Alert.alert("Peringatan", "Semua data harus diisi!!");
      return;
    }

    try {
      setLoading(true);

      await api.post("/pelanggan", {
        nama: nama,
        nomer_hp: nomerHp,
        alamat: alamat,
      });

      Alert.alert("Berhasil", "Pelanggan berhasil ditambahkan");

      setNama("");
      setNomerHp("");
      setAlamat("");
    } catch (error) {
      console.log("gagal menambahkan pelanggan", error);
      Alert.alert("Gagal", "Pelanggan gagal ditambahkan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
          }}>
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-[#0A2947] items-center justify-center">
              <Ionicons
                name="person-add-outline"
                size={24}
                color="#F3E4C9"
              />
            </View>

            <View className="ml-3">
              <Text className="text-2xl font-bold text-[#0A2947]">
                Tambah Pelanggan
              </Text>

              <Text className="text-[#8B5E3C] mt-1">
                Tambahkan pelanggan baru
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5 mt-7">
            <View>
              <Text className="text-[#0A2947] font-semibold mb-2">
                Nama Pelanggan
              </Text>

              <View className="flex-row items-center border border-[#D3D4C0] rounded-xl px-4">
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#8B5E3C"
                />

                <TextInput
                  value={nama}
                  onChangeText={setNama}
                  placeholder="Masukkan nama pelanggan"
                  placeholderTextColor="#8B5E3C"
                  className="flex-1 py-3 px-3 text-[#0A2947]"
                />
              </View>
            </View>

            <View className="mt-5">
              <Text className="text-[#0A2947] font-semibold mb-2">
                Nomor Handphone
              </Text>

              <View className="flex-row items-center border border-[#D3D4C0] rounded-xl px-4">
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#8B5E3C"
                />

                <TextInput
                  value={nomerHp}
                  onChangeText={setNomerHp}
                  placeholder="Masukkan nomor handphone"
                  placeholderTextColor="#8B5E3C"
                  keyboardType="phone-pad"
                  className="flex-1 py-3 px-3 text-[#0A2947]"
                />
              </View>
            </View>

            <View className="mt-5">
              <Text className="text-[#0A2947] font-semibold mb-2">Alamat</Text>

              <View className="flex-row items-start border border-[#D3D4C0] rounded-xl px-4">
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#8B5E3C"
                  style={{ marginTop: 14 }}
                />

                <TextInput
                  value={alamat}
                  onChangeText={setAlamat}
                  placeholder="Masukkan alamat pelanggan"
                  placeholderTextColor="#8B5E3C"
                  multiline
                  textAlignVertical="top"
                  className="flex-1 py-3 px-3 text-[#0A2947] min-h-[100px]"
                />
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="bg-[#8B5E3C] rounded-xl py-4 mt-7">
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name={loading ? "hourglass-outline" : "person-add-outline"}
                  size={21}
                  color="white"
                />

                <Text className="text-white font-bold ml-2">
                  {loading ? "Menyimpan..." : "Tambah Pelanggan"}
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
