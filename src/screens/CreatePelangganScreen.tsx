import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api";

export default function CreatePelangganScreen() {
  const [nama, setNama] = useState("");
  const [nomerHp, setNomerHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nama || !nomerHp || !alamat) {
      Alert.alert("Semua data harus diisi!!");
      return;
    }

    try {
      setLoading(true);

      await api.post("/pelanggan", {
        nama: nama,
        nomer_hp: nomerHp,
        alamat: alamat,
      });

      Alert.alert("pelanggan berhasil ditambahkan");

      setNama("");
      setNomerHp("");
      setAlamat("");
    } catch (error) {
      console.log("gagal menambahkan pelanggan", error);

      Alert.alert("Gagal, Pelanggan gagal ditambahkan ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Tambah pelanggan baru</Text>
      </View>

      <View>
        <Text>Nama</Text>
        <TextInput
          value={nama}
          onChangeText={setNama}
          placeholder="Masukan nama Pelanggan"
        />

        <TextInput
          value={nomerHp}
          onChangeText={setNomerHp}
          placeholder="Masukan nomer handphone pelanggan"
        />

        <TextInput
          value={alamat}
          onChangeText={setAlamat}
          placeholder="Masukan alamat pelanggan"
          multiline
        />
        <Pressable onPress={handleSubmit}>
          <Text>{loading ? "Menyimpan..." : "Tambah Pelanggan"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
