import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import api from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { order } from "../types/order";

export default function HistoryOrderScreen() {
  const [historyOrder, setHistoryOrder] = useState<order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const response = await api.get("/order");
      const data = response.data;

      const history = data.filter(
        (item: order) =>
          item.status === "SELESAI" &&
          item.statusPembayaran === "SUDAH_DIBAYAR",
      );

      setHistoryOrder(history);
    } catch (error) {
      console.log("gagal menampilakan histori pesanan", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSearch = historyOrder.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.orderKode.toLowerCase().includes(keyword) ||
      item.pelanggan.nama.toLowerCase().includes(keyword)
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
          Memuat hisory Order
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mb-20">
      <View className=" mt-4 mb-20 mx-4">
        <View className="bg-white p-5 rounded-2xl border border-[#0A2947] border-2">
          <Text className="text-2xl font-bold text-[#0A2947] mt-1">
            History Order
          </Text>
          <Text className="text-gray -300 text-sm">
            Data data dari pesanan yang sudah selesai dan sudah dibayar
          </Text>
        </View>

        <View className="bg-white rounded-xl border border-[#D3D4C0]  mt-4 px-4 flex-row items-center">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari histori order..."
            className="flex-1 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <FlatList
          data={filterSearch}
          keyExtractor={(item) => item.id.toString()}
          className="mt-4"
          renderItem={({ item }) => (
            <Pressable className="bg-white rounded-2xl p-4 mb-3 border border-[#D3D4C0]">
              <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-base">{item.orderKode}</Text>
                <Text className="text-orange-500 font-semibold">Selesai</Text>
              </View>
              <Text className="text-gray-600">{item.pelanggan.nama}</Text>
              <Text className="text-gray-500 mt-1">Lunas</Text>
              <Text className="text-gray-500 mt-1">
                Rp. {Number(item.total).toLocaleString("id-ID")}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
