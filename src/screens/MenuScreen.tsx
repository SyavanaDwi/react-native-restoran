import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { BottomTabParamList } from "../navigation/types";
import api from "../services/api";
import { Menu } from "../types/menu";

type Props = NativeStackScreenProps<BottomTabParamList, "Menu">;

export default function MenuScreen({ navigation }: Props) {
  const [menuResto, setMenuResto] = useState<Menu[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateMenu, setUpdateMenu] = useState<number | null>(null);

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const menu = await api.get("/menu");

      setMenuResto(menu.data);
    } catch (error) {
      console.log("gagal menampilkan menu");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = async (item: Menu) => {
    try {
      setUpdateMenu(item.id);

      const statusBaru = !item.statusMenu;

      await api.put(`/menu/${item.id}`, {
        statusMenu: statusBaru,
      });

      await getMenu();

      Alert.alert(
        "Berhasil",
        statusBaru
          ? `${item.menu} sekarang aktif`
          : `${item.menu} sekarang dinonaktifkan`,
      );
    } catch (error: any) {
      console.log("gagal mengubah status menu", error);

      Alert.alert(
        "Gagal",
        error?.response?.data?.message || "Gagal mengubah status menu",
      );
    } finally {
      setUpdateMenu(null);
    }
  };

  const filterSearch = menuResto.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.menu?.toLowerCase().includes(keyword) ||
      item.kategori?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F3E4C9]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#0A2947"
          />

          <Text className="text-[#8B5E3C] mt-4 text-base">
            Memuat daftar menu...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9] mt-5">
      <View className="flex-1 px-5">
        <FlatList
          data={filterSearch}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          ListHeaderComponent={
            <View>
              <View className="flex-row items-center pt-2 pb-5">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-[#0A2947]">
                    Daftar Menu
                  </Text>

                  <Text className="text-[#8B5E3C] mt-1">
                    Kelola menu restoran
                  </Text>
                </View>

                <View className="w-11 h-11 rounded-full bg-[#0A2947] items-center justify-center">
                  <Ionicons
                    name="restaurant-outline"
                    size={23}
                    color="#F3E4C9"
                  />
                </View>
              </View>

              <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center mb-5">
                <Ionicons
                  name="search-outline"
                  size={21}
                  color="#8B5E3C"
                />

                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Cari menu..."
                  placeholderTextColor="#999"
                  className="flex-1 ml-3 text-[#0A2947]"
                />
              </View>

              <View className="flex-row items-center mb-3">
                <View className="w-9 h-9 rounded-full bg-[#0A2947] items-center justify-center">
                  <Ionicons
                    name="restaurant"
                    size={18}
                    color="#F3E4C9"
                  />
                </View>

                <View className="ml-3">
                  <Text className="text-lg font-bold text-[#0A2947]">
                    Menu Restoran
                  </Text>

                  <Text className="text-gray-500 text-sm">
                    {filterSearch.length} menu ditemukan
                  </Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="bg-white rounded-2xl p-6 items-center mt-2">
              <View className="w-16 h-16 rounded-full bg-[#F3E4C9] items-center justify-center">
                <Ionicons
                  name="restaurant-outline"
                  size={30}
                  color="#8B5E3C"
                />
              </View>

              <Text className="text-[#0A2947] font-bold text-lg mt-4">
                Menu tidak ditemukan
              </Text>

              <Text className="text-gray-500 text-center mt-2">
                Tidak ada menu yang sesuai dengan pencarian.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl p-5 mb-4">
              <Pressable>
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-full bg-[#F3E4C9] items-center justify-center">
                    <Ionicons
                      name="restaurant"
                      size={23}
                      color="#8B5E3C"
                    />
                  </View>

                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-bold text-[#0A2947]">
                      {item.menu}
                    </Text>

                    <Text className="text-[#8B5E3C] font-bold mt-1">
                      Rp {Number(item.harga).toLocaleString("id-ID")}
                    </Text>
                  </View>

                  <View
                    className={`px-3 py-1 rounded-full ${
                      item.statusMenu ? "bg-[#D3D4C0]" : "bg-gray-200"
                    }`}>
                    <Text className="text-[#0A2947] text-xs font-bold">
                      {item.statusMenu ? "Aktif" : "Nonaktif"}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-[#D3D4C0] mt-4 pt-4">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="pricetag-outline"
                      size={17}
                      color="#8B5E3C"
                    />

                    <Text className="text-gray-500 ml-2">{item.kategori}</Text>
                  </View>

                  <Text
                    className="text-gray-600 mt-3"
                    numberOfLines={2}>
                    {item.deskripsi || "Tidak ada deskripsi menu."}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => toggleMenu(item)}
                disabled={updateMenu === item.id}
                className={`rounded-xl py-3 mt-4 ${
                  item.statusMenu ? "bg-[#8B5E3C]" : "bg-[#0A2947]"
                }`}>
                <View className="flex-row items-center justify-center">
                  <Ionicons
                    name={
                      item.statusMenu
                        ? "close-circle-outline"
                        : "checkmark-circle-outline"
                    }
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text className="text-white font-bold ml-2">
                    {updateMenu === item.id
                      ? "Mengubah..."
                      : item.statusMenu
                        ? "Nonaktifkan Menu"
                        : "Aktifkan Menu"}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
