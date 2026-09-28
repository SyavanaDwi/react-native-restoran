import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList, BottomTabParamList } from "../navigation/types";

import { userAuthStore } from "../stores/authStore";
import { order } from "../types/order";
import api from "../services/api";

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList, "MainTab">
>;

export default function HomeScreen({ navigation }: Props) {
  const user = userAuthStore((state) => state.user);

  const [orders, setOrders] = useState<order[]>([]);
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
      {/* HEADER DASHBOARD + PROFILE */}
      <View className="px-5 py-4 mx-4 rounded-xl border-2 border-[#0A2947]">
        <View className="flex-row items-center justify-between">
          {/* BAGIAN KIRI */}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-[#0A2947]">
              Dashboard Operasional
            </Text>

            <Text className="text-gray-800 text-sm">
              Selamat datang, {user?.nama}
            </Text>
          </View>

          {/* PROFILE */}
          <Pressable className="ml-3 items-center">
            {/* ICON PROFILE */}
            <View className="w-12 h-12 rounded-full bg-[#0A2947] items-center justify-center">
              <Ionicons
                name="person"
                size={20}
                color="white"
              />
            </View>

            {/* NAMA USER */}
            <Text
              className="text-[#0A2947] font-semibold text-xs mt-1"
              numberOfLines={1}>
              {user?.nama}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* STATISTIK */}
      <View className="flex-row px-5 mt-6">
        <Pressable
          onPress={() => setFilterStatus("onProgress")}
          className="flex-1 bg-white rounded-xl p-4 mr-2 border border-[#D3D4C0]">
          <Text className="text-gray-900 text-sm">Sedang</Text>

          <Text className="text-gray-900 text-sm">Diproses</Text>

          <Text className="text-2xl font-bold text-[#0A2947] mt-2">
            {statusOnProgress}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilterStatus("served")}
          className="flex-1 bg-white rounded-xl border border-[#D3D4C0] p-4 mx-1">
          <Text className="text-gray-900 text-sm">Siap</Text>

          <Text className="text-gray-900 text-sm">Disajikan</Text>

          <Text className="text-2xl font-bold text-[#0A2947] mt-2">
            {statusServed}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilterStatus("unpaid")}
          className="flex-1 bg-white rounded-xl border border-[#D3D4C0] p-4 ml-2">
          <Text className="text-gray-900 text-sm">Belum</Text>

          <Text className="text-gray-900 text-sm">Lunas</Text>

          <Text className="text-2xl font-bold text-[#0A2947] mt-2">
            {unpaid}
          </Text>
        </Pressable>
      </View>

      {/* PESANAN BARU */}
      <View className="px-4 mt-5">
        <Pressable
          className="bg-[#8B5E3C] rounded-xl py-4"
          onPress={() => navigation.navigate("NewOrder")}>
          <Text className="text-white text-center font-bold text-base">
            + Pesanan Baru
          </Text>
        </Pressable>
      </View>

      {/* JUDUL + SEARCH */}
      <View className="mx-4 mt-4 mb-3">
        <Text className="text-xl font-bold text-[#0A2947]">
          Pesanan Terbaru
        </Text>

        <View className="bg-white rounded-xl border border-[#8B5E3C] mt-4 px-4 flex-row items-center">
          <TextInput
            className="flex-1 py-3 text-base"
            placeholder="Cari kode order atau nama pelanggan..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* LIST PESANAN */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <View>
            <View className="px-5 mb-4">
              {filterStatus !== null && (
                <Pressable
                  className="mt-3"
                  onPress={() => setFilterStatus(null)}>
                  <Text className="text-[#0A2947] font-semibold">
                    Tampilkan Semua Pesanan...
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
            <View className="bg-white rounded-2xl p-4 mb-3 border border-[#D3D4C0]">
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
