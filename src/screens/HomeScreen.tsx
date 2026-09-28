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
import * as SecureStore from "expo-secure-store";

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
  const [profileMenu, setProfileMenu] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await api.get("/order");
        setOrders(response.data);
      } catch (error) {
        console.log("error menampilkan data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      userAuthStore.getState().clearUser();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Gagal Logout", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F3E4C9]">
        <ActivityIndicator
          size="large"
          color="#0A2947"
        />
        <Text className="text-[#0A2947] mt-4">Memuat HomeScreen...</Text>
      </View>
    );
  }

  const activeOrders = orders.filter(
    (item) =>
      item.status === "MENUNGGU" ||
      item.status === "DIKONFIRMASI" ||
      item.status === "DISIAPKAN" ||
      item.status === "SIAP",
  );

  const filterStatusOrder = activeOrders.filter((item) => {
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

  const statusOnProgress = activeOrders.filter(
    (item) =>
      item.status === "MENUNGGU" ||
      item.status === "DIKONFIRMASI" ||
      item.status === "DISIAPKAN",
  ).length;

  const statusServed = activeOrders.filter(
    (item) => item.status === "SIAP",
  ).length;

  const unpaid = activeOrders.filter(
    (item) => item.statusPembayaran === "BELUM_DIBAYAR",
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9]">
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 30,
        }}
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold text-[#0A2947]">
                  Dashboard
                </Text>

                <Text className="text-[#8B5E3C] mt-1">
                  Selamat datang, {user?.nama}
                </Text>
              </View>

              <View className="relative items-center">
                <Pressable
                  onPress={() => setProfileMenu(!profileMenu)}
                  className="items-center">
                  <View className="w-12 h-12 rounded-full bg-[#0A2947] items-center justify-center">
                    <Ionicons
                      name="person"
                      size={23}
                      color="#F3E4C9"
                    />
                  </View>

                  <Text
                    className="text-[#0A2947] text-xs font-semibold mt-1"
                    numberOfLines={1}>
                    {user?.nama}
                  </Text>
                </Pressable>

                {profileMenu && (
                  <View className="absolute right-0 top-16 w-40 bg-white rounded-xl border border-[#D3D4C0] z-50">
                    <Pressable
                      className="px-4 py-3 flex-row items-center"
                      onPress={() => {
                        setProfileMenu(false);
                        navigation.navigate("EditProfile");
                      }}>
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#0A2947"
                      />

                      <Text className="ml-3 text-[#0A2947]">Edit Profile</Text>
                    </Pressable>

                    <Pressable
                      className="px-4 py-3 flex-row items-center border-t border-[#D3D4C0]"
                      onPress={handleLogout}>
                      <Ionicons
                        name="log-out-outline"
                        size={20}
                        color="#8B5E3C"
                      />

                      <Text className="ml-3 text-[#8B5E3C]">Logout</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            <View className="flex-row mt-6">
              <Pressable
                onPress={() => setFilterStatus("onProgress")}
                className={`flex-1 rounded-2xl p-4 mr-2 ${
                  filterStatus === "onProgress" ? "bg-[#0A2947]" : "bg-white"
                }`}>
                <Ionicons
                  name="time-outline"
                  size={23}
                  color={filterStatus === "onProgress" ? "#F3E4C9" : "#0A2947"}
                />

                <Text
                  className={`text-sm mt-3 ${
                    filterStatus === "onProgress"
                      ? "text-[#F3E4C9]"
                      : "text-[#0A2947]"
                  }`}>
                  Sedang Diproses
                </Text>

                <Text
                  className={`text-3xl font-bold mt-1 ${
                    filterStatus === "onProgress"
                      ? "text-white"
                      : "text-[#0A2947]"
                  }`}>
                  {statusOnProgress}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setFilterStatus("served")}
                className={`flex-1 rounded-2xl p-4 mx-1 ${
                  filterStatus === "served" ? "bg-[#0A2947]" : "bg-white"
                }`}>
                <Ionicons
                  name="restaurant-outline"
                  size={23}
                  color={filterStatus === "served" ? "#F3E4C9" : "#0A2947"}
                />

                <Text
                  className={`text-sm mt-3 ${
                    filterStatus === "served"
                      ? "text-[#F3E4C9]"
                      : "text-[#0A2947]"
                  }`}>
                  Siap Disajikan
                </Text>

                <Text
                  className={`text-3xl font-bold mt-1 ${
                    filterStatus === "served" ? "text-white" : "text-[#0A2947]"
                  }`}>
                  {statusServed}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setFilterStatus("unpaid")}
                className={`flex-1 rounded-2xl p-4 ml-2 ${
                  filterStatus === "unpaid" ? "bg-[#0A2947]" : "bg-white"
                }`}>
                <Ionicons
                  name="wallet-outline"
                  size={23}
                  color={filterStatus === "unpaid" ? "#F3E4C9" : "#0A2947"}
                />

                <Text
                  className={`text-sm mt-3 ${
                    filterStatus === "unpaid"
                      ? "text-[#F3E4C9]"
                      : "text-[#0A2947]"
                  }`}>
                  Belum Lunas
                </Text>

                <Text
                  className={`text-3xl font-bold mt-1 ${
                    filterStatus === "unpaid" ? "text-white" : "text-[#0A2947]"
                  }`}>
                  {unpaid}
                </Text>
              </Pressable>
            </View>

            <Pressable
              className="bg-[#8B5E3C] rounded-2xl py-4 mt-5"
              onPress={() => navigation.navigate("NewOrder")}>
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color="white"
                />

                <Text className="text-white text-center font-bold ml-2">
                  Pesanan Baru
                </Text>
              </View>
            </Pressable>

            <View className="mt-6 mb-3">
              <Text className="text-xl font-bold text-[#0A2947]">
                Pesanan Terbaru
              </Text>

              <View className="bg-white rounded-2xl mt-3 px-4 flex-row items-center">
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#0A2947"
                />

                <TextInput
                  className="flex-1 py-3 px-3 text-[#0A2947]"
                  placeholder="Cari pesanan..."
                  placeholderTextColor="#8B5E3C"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            {filterStatus !== null && (
              <Pressable
                className="mb-3"
                onPress={() => setFilterStatus(null)}>
                <Text className="text-[#0A2947] font-semibold">
                  Tampilkan Semua Pesanan
                </Text>
              </Pressable>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("DetailOrder", {
                orderId: item.id,
              })
            }>
            <View className="bg-white rounded-2xl p-4 mb-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[#0A2947] font-bold text-base">
                  {item.orderKode}
                </Text>

                <View className="bg-[#D3D4C0] px-3 py-1 rounded-full">
                  <Text className="text-[#8B5E3C] text-xs font-bold">
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text className="text-[#0A2947] mt-3 font-medium">
                {item.pelanggan.nama}
              </Text>

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[#8B5E3C] text-sm">
                  {item.statusPembayaran}
                </Text>

                <Text className="text-[#0A2947] font-bold">
                  Rp. {Number(item.total).toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center mt-8">
            <Ionicons
              name="receipt-outline"
              size={45}
              color="#8B5E3C"
            />

            <Text className="text-[#0A2947] mt-3 text-base">
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
