import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import api from "../services/api";
import { useEffect, useState } from "react";
import { Menu } from "../types/menu";

type Props = NativeStackScreenProps<RootStackParamList, "Menu">;

export default function MenuScreen({ navigation }: Props) {
  const [menuResto, setMenuResto] = useState<Menu[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getMenu = async () => {
      try {
        const menu = await api.get("/menu");
        setMenuResto(menu.data);
      } catch (error) {
        console.log("gagal menampilan menu");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMenu();
  }, []);

  const filterSearch = menuResto.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.menu.toLowerCase().includes(keyword) ||
      item.kategori.toLowerCase().includes(keyword)
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
          Memuat daftar Menu...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mx-2">
      <View className="flex-1 px-3 pt-5">
        <Text className="text-2xl font-bold text-gray-900">
          Daftar menu restoran
        </Text>
        <Text className="mt-2 mb-4 text-gray-900">
          Semua daftar menu restoran saya
        </Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="cari Menu..."
          className="mt-5 rounded-xl border border-gray-200 p-4 mb-5"
        />

        <FlatList
          data={filterSearch}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable className="mb-4 rounded-xl bg-white p-5 shadow">
              <Text className="text-xl font-bold text-gray-900">
                {item.menu}
              </Text>
              <Text className="mt-2 text-gray-500">
                Rp {Number(item.harga).toLocaleString("id-ID")}
              </Text>
              <Text>{item.deskripsi}</Text>
              <Text>{item.kategori}</Text>
              <Text>{item.statusMenu ? "aktif" : "nonaktif"}</Text>
            </Pressable>
          )}></FlatList>
      </View>
    </SafeAreaView>
  );
}
