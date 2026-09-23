import { View, Text, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import api from "../services/api";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type Props = NativeStackScreenProps<RootStackParamList, "Menu">;

const menu = [
  {
    id: 1,
    nama: "nasi goreng",
    harga: 25000,
  },
  {
    id: 2,
    nama: "nasi goreng",
    harga: 25000,
  },
  {
    id: 3,
    nama: "nasi goreng",
    harga: 25000,
  },
];

export default function MenuScreen({ navigation }: Props) {
  // const login = async () => {
  //   try {
  //     const response = await api.get("/auth/login", {});

  //     console.log("LOGIN BERHASIL");
  //   } catch (error) {
  //     console.log("LOGIN ERROR");
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   login();
  // }, []);

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
          data={menu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("DetailMenu", {
                  menuId: item.id,
                  nama: item.nama,
                  harga: item.harga,
                })
              }
              className="mb-4 rounded-xl bg-gray-100 p-5 shadow">
              <Text className="text-xl font-bold text-gray-900">
                {item.nama}
              </Text>
              <Text className="mt-2 text-gray-500">
                Rp {item.harga.toLocaleString("id-ID")}
              </Text>
            </Pressable>
          )}></FlatList>
      </View>
    </SafeAreaView>
  );
}
