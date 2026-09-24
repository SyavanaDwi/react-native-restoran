import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";

import { useState, useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/types";

import { userAuthStore } from "../stores/authStore";

import { order as OrderType } from "../types/order";

import api from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const user = userAuthStore((state) => state.user);

  const [orders, setOrders] = useState<OrderType[]>([]);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await api.get("/order");

        setOrders(response.data);

        console.log("order data");
      } catch (error) {
        console.log("error menampilkan data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator
          size="large"
          color="#0A2947"
        />

        <Text className="text-gray-500 mt-4 text-base">
          Memuat HomeScreen...
        </Text>
      </View>
    );
  }

  const filterStatusOrder = orders.filter((item) => {
    if (filterStatus === null) {
      return true;
    }

    if (filterStatus === "onProgress") {
      return (
        item.status === "MENUNGGU" ||
        item.status === "DIKONFIRMASI" ||
        item.status === "DISIAPKAN"
      );
    }

    if (filterStatus === "served") {
      return item.status === "SIAP";
    }

    if (filterStatus === "unpaid") {
      return item.statusPembayaran === "BELUM_DIBAYAR";
    }

    return true;
  });

  const filteredOrders = filterStatusOrder.filter((item) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return true;
    }

    const orderKode = item.orderKode?.toLowerCase() || "";

    const namaPelanggan = item.pelanggan?.nama?.toLowerCase() || "";

    return orderKode.includes(keyword) || namaPelanggan.includes(keyword);
  });

  const statusOnProgress = orders.filter(
    (item) =>
      item.status === "MENUNGGU" ||
      item.status === "DIKONFIRMASI" ||
      item.status === "DISIAPKAN",
  ).length;

  const statusServed = orders.filter((item) => item.status === "SIAP").length;

  const unpaid = orders.filter(
    (item) => item.statusPembayaran === "BELUM_DIBAYAR",
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
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
                onPress={() => navigation.navigate("NewOrder")}>
                <Text className="text-white text-center font-bold text-base">
                  + Pesanan Baru
                </Text>
              </Pressable>
            </View>

            <View className="px-5 mt-5">
              <Pressable
                className="bg-[#0A2947] rounded-xl py-4"
                onPress={() => navigation.navigate("Menu")}>
                <Text className="text-white text-center font-bold text-base">
                  Lihat Menu
                </Text>
              </Pressable>
            </View>

            <View className="flex-row px-5 mt-6">
              <Pressable
                onPress={() => setFilterStatus("onProgress")}
                className="flex-1 bg-white rounded-xl p-4 mr-2">
                <Text className="text-gray-500 text-sm">Sedang</Text>

                <Text className="text-gray-500 text-sm">Diproses</Text>

                <Text className="text-2xl font-bold text-[#0A2947] mt-2">
                  {statusOnProgress}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setFilterStatus("served")}
                className="flex-1 bg-white rounded-xl p-4 mx-1">
                <Text className="text-gray-500 text-sm">Siap</Text>

                <Text className="text-gray-500 text-sm">Disajikan</Text>

                <Text className="text-2xl font-bold text-[#0A2947] mt-2">
                  {statusServed}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setFilterStatus("unpaid")}
                className="flex-1 bg-white rounded-xl p-4 ml-2">
                <Text className="text-gray-500 text-sm">Belum</Text>

                <Text className="text-gray-500 text-sm">Lunas</Text>

                <Text className="text-2xl font-bold text-[#0A2947] mt-2">
                  {unpaid}
                </Text>
              </Pressable>
            </View>

            <View className="px-5 mt-7 mb-4">
              <Text className="text-xl font-bold text-[#0A2947]">
                Pesanan Terbaru
              </Text>

              <View className="bg-white rounded-xl mt-4 px-4 flex-row items-center">
                <TextInput
                  className="flex-1 py-3 text-base"
                  placeholder="Cari kode order atau nama pelanggan..."
                  placeholderTextColor="#9CA3AF"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              {filterStatus !== null && (
                <Pressable
                  className="mt-3"
                  onPress={() => setFilterStatus(null)}>
                  <Text className="text-[#0A2947] font-semibold">
                    Tampilkan Semua Pesanan
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            className="mx-5"
            onPress={() =>
              navigation.navigate("DetailOrder", {
                orderId: item.id,
              })
            }>
            <View className="bg-white rounded-2xl p-4 mb-3">
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
        )}
        ListEmptyComponent={
          <View className="items-center px-5 mt-5">
            <Text className="text-gray-500 text-base text-center">
              {search
                ? "Order yang dicari tidak ditemukan."
                : "Belum ada pesanan."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
