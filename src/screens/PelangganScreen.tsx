import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pelanggan } from "../types/pelanngan";
import api from "../services/api";
import { BottomTabParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";

export default function PelangganScreen() {
  const [pelangganResto, setPelanggan] = useState<Pelanggan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPelanggan = async () => {
      try {
        const pelanggan = await api.get("/pelanggan");

        console.log("data pelanggan: ");
        setPelanggan(pelanggan.data.data);
      } catch (error) {
        console.log("gagal menampilkan data pelanggan");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPelanggan();
  }, []);

  const filterSearch = pelangganResto.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.nama?.toLowerCase().includes(keyword) ||
      item.nomer_hp?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator
          size="large"
          color="#0A2947"
        />
        <Text className="text-gray-500 mt-4 text-base">
          Memuat Daftar Pelanggan...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className=" flex-1 bg-gray-100 my-5 mx-5">
      <View>
        <Text>Daftar Pelanggan & Member</Text>
        <Text>Kelola data Pelanggan dan Member</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Cara Pelanggan..."
          className="mt-5 rounded-xl border border-gray-300 p-4"
        />
        <FlatList
          data={filterSearch}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable>
              <Text>{item.nama}</Text>
              <Text>{item.nomer_hp}</Text>
              <Text>{item.alamat}</Text>
              <Text>
                {item.member === null
                  ? "bukan member"
                  : item.member?.statusMember
                    ? "member aktif"
                    : "member tidak aktif"}
              </Text>
              <Text>{item.statusPelanggan ? "aktif" : "blacklist"}</Text>
            </Pressable>
          )}></FlatList>
      </View>
    </SafeAreaView>
  );
}
