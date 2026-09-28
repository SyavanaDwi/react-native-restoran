import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import { RootStackParamList } from "../navigation/types";
import { Menu } from "../types/menu";
import api from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "DetailMenu">;

export default function DetailMenu({ navigation, route }: Props) {
  const { menuId } = route.params;

  const [menuResto, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMenu = async () => {
      try {
        const menuResto = await api.get(`/menu/${menuId}`);
        setMenu(menuResto.data);
        console.log("MENU: ", menuResto.data);
      } catch (error) {
        console.log("error detail menu");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getMenu();
  }, [menuId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F3E4C9]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#0A2947"
          />

          <Text className="text-[#8B5E3C] mt-4 text-base">
            Memuat detail menu...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}>
        <View className="flex-row items-center pt-2 pb-5">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-11 h-11 rounded-full bg-[#0A2947] items-center justify-center">
            <Ionicons
              name="arrow-back"
              size={23}
              color="#F3E4C9"
            />
          </Pressable>

          <View className="ml-4 flex-1">
            <Text className="text-2xl font-bold text-[#0A2947]">
              Detail Menu
            </Text>

            <Text className="text-[#8B5E3C] mt-1">Informasi lengkap menu</Text>
          </View>

          <View className="w-11 h-11 rounded-full bg-[#0A2947] items-center justify-center">
            <Ionicons
              name="restaurant-outline"
              size={23}
              color="#F3E4C9"
            />
          </View>
        </View>

        <View className="bg-white rounded-2xl overflow-hidden">
          <View className="bg-[#0A2947] px-5 py-6 items-center">
            <View className="w-20 h-20 rounded-full bg-[#F3E4C9] items-center justify-center">
              <Ionicons
                name="restaurant"
                size={38}
                color="#8B5E3C"
              />
            </View>

            <Text className="text-white text-2xl font-bold mt-4 text-center">
              {menuResto?.menu || "-"}
            </Text>

            <View className="bg-[#F3E4C9] px-3 py-1 rounded-full mt-3">
              <Text className="text-[#8B5E3C] text-xs font-bold">
                {menuResto?.kategori || "-"}
              </Text>
            </View>
          </View>

          <View className="p-5">
            <View className="flex-row items-center justify-between border-b border-[#D3D4C0] pb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#F3E4C9] items-center justify-center">
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color="#8B5E3C"
                  />
                </View>

                <View className="ml-3">
                  <Text className="text-xs text-[#8B5E3C]">Harga</Text>

                  <Text className="text-lg font-bold text-[#0A2947] mt-1">
                    Rp {Number(menuResto?.harga || 0).toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>

              <View
                className={`px-3 py-2 rounded-full ${
                  menuResto?.statusMenu ? "bg-[#D3D4C0]" : "bg-gray-200"
                }`}>
                <Text className="text-[#0A2947] text-xs font-bold">
                  {menuResto?.statusMenu ? "Tersedia" : "Tidak Tersedia"}
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text className="text-[#0A2947] font-bold text-base">
                Deskripsi
              </Text>

              <View className="bg-[#F3E4C9] rounded-xl p-4 mt-3">
                <Text className="text-[#8B5E3C] leading-6">
                  {menuResto?.deskripsi ||
                    "Tidak ada deskripsi untuk menu ini."}
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text className="text-[#0A2947] font-bold text-base">
                Informasi Menu
              </Text>

              <View className="bg-[#F3E4C9] rounded-xl p-4 mt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#8B5E3C]">ID Menu</Text>

                  <Text className="font-semibold text-[#0A2947]">
                    #{menuResto?.id}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-3">
                  <Text className="text-[#8B5E3C]">Kategori</Text>

                  <Text className="font-semibold text-[#0A2947]">
                    {menuResto?.kategori || "-"}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-3">
                  <Text className="text-[#8B5E3C]">Status</Text>

                  <Text className="font-semibold text-[#0A2947]">
                    {menuResto?.statusMenu ? "Aktif" : "Tidak Aktif"}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => navigation.goBack()}
              className="bg-[#8B5E3C] rounded-xl py-4 mt-6">
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color="#FFFFFF"
                />

                <Text className="text-white font-bold ml-2">Kembali</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
