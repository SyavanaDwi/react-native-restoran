import { View, Text, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import api from "../services/api";
import { useEffect, useState } from "react";
import { menu } from "../types/menu";
import * as SecureStore from "expo-secure-store";

type Props = NativeStackScreenProps<RootStackParamList, "Menu">;

export default function MenuScreen({ navigation }: Props) {
  const [menuResto, setMenuResto] = useState<menu[]>([]);
  useEffect(() => {
    const getMenu = async () => {
      try {
        const menu = await api.get("/menu");
        console.log(menu.data);
        setMenuResto(menu.data);
      } catch (error) {
        console.log("gagal menampilan menu");
        console.log(error);
      }
    };
    getMenu();
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-3 pt-5">
        <Text className="text-2xl font-bold text-gray-900">
          Daftar menu restoran
        </Text>
        <Text className="mt-2 mb-4 text-gray-900">
          Semua daftar menu restoran saya
        </Text>

        <FlatList
          data={menuResto}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("DetailMenu", {
                  menuId: item.id,
                })
              }
              className="mb-4 rounded-xl bg-gray-100 p-5 shadow">
              <Text className="text-xl font-bold text-gray-900">
                {item.menu}
              </Text>
              <Text className="mt-2 text-gray-500">Rp {item.harga}</Text>
            </Pressable>
          )}></FlatList>
      </View>
    </SafeAreaView>
  );
}
