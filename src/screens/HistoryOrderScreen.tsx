import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import api from "../services/api";
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
      console.log("gagal menampilkan histori pesanan", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSearch = historyOrder.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.orderKode?.toLowerCase().includes(keyword) ||
      item.pelanggan?.nama?.toLowerCase().includes(keyword)
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
            Memuat history order...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9]  ">
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
                    History Order
                  </Text>

                  <Text className="text-[#8B5E3C] mt-1">
                    Riwayat pesanan yang sudah selesai
                  </Text>
                </View>

                <View className="w-11 h-11 rounded-full bg-[#0A2947] items-center justify-center">
                  <Ionicons
                    name="time-outline"
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
                  placeholder="Cari histori order..."
                  placeholderTextColor="#999"
                  className="flex-1 ml-3 text-[#0A2947]"
                />
              </View>

              <View className="flex-row items-center mb-3">
                <View className="w-9 h-9 rounded-full bg-[#0A2947] items-center justify-center">
                  <Ionicons
                    name="receipt-outline"
                    size={19}
                    color="#F3E4C9"
                  />
                </View>

                <View className="ml-3">
                  <Text className="text-lg font-bold text-[#0A2947]">
                    Pesanan Selesai
                  </Text>

                  <Text className="text-gray-500 text-sm">
                    {filterSearch.length} pesanan ditemukan
                  </Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="bg-white rounded-2xl p-6 items-center mt-2">
              <View className="w-16 h-16 rounded-full bg-[#F3E4C9] items-center justify-center">
                <Ionicons
                  name="receipt-outline"
                  size={30}
                  color="#8B5E3C"
                />
              </View>

              <Text className="text-[#0A2947] font-bold text-lg mt-4">
                History tidak ditemukan
              </Text>

              <Text className="text-gray-500 text-center mt-2">
                Belum ada pesanan selesai dan sudah dibayar yang sesuai.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable className="bg-white rounded-2xl p-5 mb-4">
              <View className="flex-row items-start">
                <View className="w-12 h-12 rounded-full bg-[#F3E4C9] items-center justify-center">
                  <Ionicons
                    name="receipt"
                    size={23}
                    color="#8B5E3C"
                  />
                </View>

                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-[#0A2947]">
                    {item.orderKode}
                  </Text>

                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="person-outline"
                      size={14}
                      color="#8B5E3C"
                    />

                    <Text className="text-gray-500 ml-2">
                      {item.pelanggan.nama}
                    </Text>
                  </View>
                </View>

                <View className="bg-[#D3D4C0] px-3 py-1 rounded-full">
                  <Text className="text-[#0A2947] text-xs font-bold">
                    Selesai
                  </Text>
                </View>
              </View>

              <View className="border-t border-[#D3D4C0] mt-4 pt-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#8B5E3C"
                    />

                    <Text className="text-gray-500 ml-2">Pembayaran</Text>
                  </View>

                  <Text className="text-[#0A2947] font-semibold">Lunas</Text>
                </View>

                <View className="flex-row justify-between items-center mt-3">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="cash-outline"
                      size={18}
                      color="#8B5E3C"
                    />

                    <Text className="text-gray-500 ml-2">Total</Text>
                  </View>

                  <Text className="text-lg font-bold text-[#8B5E3C]">
                    Rp {Number(item.total).toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
