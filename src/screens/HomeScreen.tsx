import { View, Text, Pressable, ScrollView, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { userAuthStore } from "../stores/authStore";
import { order } from "../types/order";
import api from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const user = userAuthStore((state) => state.user);

  const [order, setOrder] = useState<order[]>([]);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await api.get("/order");

        console.log("order data");
        console.log(response.data);

        setOrder(response.data);
      } catch (error) {
        console.log("error menampilkan data");
        console.log(error);
      }
    };
    getOrder();
  }, []);

  return (
    // <SafeAreaView className="flex-1 bg-white">
    <ScrollView className="flex-1">
      <View className="px-5 pt-5">
        <Text className="text-gray-500 text-sm">
          Selamat datang, {user?.nama}
        </Text>

        <Text className="text-2xl font-bold text-[#0A2947] mt-1">
          Dashboard Operasional
        </Text>
      </View>

      <View className="px-5 mt-5">
        <Pressable
          className="bg-[#0A2947] rounded-xl py-4"
          onPress={() => console.log("Pesanan baru")}>
          <Text className="text-white text-center font-bold text-base">
            + Pesanan Baru
          </Text>
        </Pressable>
      </View>

      <View className="flex-row px-5 mt-6">
        <View className="flex-1 bg-white rounded-xl p-4 mr-2">
          <Text className="text-gray-500 text-sm">Sedang</Text>

          <Text className="text-gray-500 text-sm">Diproses</Text>

          <Text className="text-2xl font-bold text-[#0A2947] mt-2">3</Text>
        </View>

        <View className="flex-1 bg-white rounded-xl p-4 mx-1">
          <Text className="text-gray-500 text-sm">Siap</Text>

          <Text className="text-gray-500 text-sm">Disajikan</Text>

          <Text className="text-2xl font-bold text-[#0A2947] mt-2">2</Text>
        </View>

        <View className="flex-1 bg-white rounded-xl p-4 ml-2">
          <Text className="text-gray-500 text-sm">Belum</Text>

          <Text className="text-gray-500 text-sm">Lunas</Text>

          <Text className="text-2xl font-bold text-[#0A2947] mt-2">4</Text>
        </View>
      </View>

      <View className=" px-5">
        <Text className="text-xl font-bold text-[#0A2947] mb-4">
          pesanan terbaru
        </Text>

        <FlatList
          data={order}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("DetailOrder", {
                  orderId: item.id,
                })
              }>
              <View className="bg-gray-100 rounded-2xl p-4 mb-3">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-bold text-base">{item.orderKode}</Text>

                  <Text className="text-orange-500 font-semibold">
                    {item.status}
                  </Text>
                </View>

                <Text className="text-gray-600">{item.pelanggan.nama}</Text>

                <Text className="text-gray-500 mt-1">
                  {item.statusPembayaran}
                </Text>
                <Text className="text-gray-500 mt-1">
                  Rp. {Number(item.total).toLocaleString("id-ID")}
                </Text>
              </View>
            </Pressable>
          )}></FlatList>
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
}
