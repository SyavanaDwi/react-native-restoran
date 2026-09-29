import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/types";
import api from "../services/api";
import { order } from "../types/order";
import { userAuthStore } from "../stores/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "DetailOrder">;

export default function DetailOrder({ navigation, route }: Props) {
  const { orderId } = route.params;

  const [orderDetail, setOrderDetail] = useState<order | null>(null);
  const [loading, setLoading] = useState(true);

  const [updateStatus, setUpdateStatus] = useState(false);

  const [metodePembayaran, setMetodePembayaran] = useState("CASH");
  const [jumlahDibayar, setJumlahDibayar] = useState("");
  const [showMetode, setShowMetode] = useState(false);
  const [prosesPembayaran, setProsesPembayaran] = useState(false);

  const user = userAuthStore((state) => state.user);

  useEffect(() => {
    const getOrderDetail = async () => {
      try {
        const orderDetailResto = await api.get(`/order/${orderId}`);

        setOrderDetail(orderDetailResto.data.data);
      } catch (error) {
        console.log("error pada detail order");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetail();
  }, [orderId]);

  const updateStatusOrder = async (status: string) => {
    try {
      setUpdateStatus(true);

      await api.patch(`/order/status/${orderId}`, {
        status: status,
      });

      const response = await api.get(`/order/${orderId}`);

      setOrderDetail(response.data.data);
    } catch (error: any) {
      console.log("error update status");
      console.log(error);

      console.log("status error:", error.response?.status);
      console.log("data error:", error.response?.data);

      Alert.alert(
        "Gagal",
        error.response?.data?.message || "Status order gagal diubah.",
      );
    } finally {
      setUpdateStatus(false);
    }
  };

  const prosesBayar = async () => {
    if (!orderDetail) {
      return;
    }

    const jumlah = Number(jumlahDibayar);

    if (!jumlahDibayar || jumlah <= 0) {
      Alert.alert("Perhatian", "Masukkan jumlah uang yang diterima.");
      return;
    }

    if (jumlah < Number(orderDetail.total)) {
      Alert.alert(
        "Pembayaran Kurang",
        "Jumlah uang yang diterima masih kurang dari total pembayaran.",
      );
      return;
    }

    if (!user) {
      Alert.alert(
        "Error",
        "Data kasir tidak ditemukan. Silakan login kembali.",
      );
      return;
    }

    try {
      setProsesPembayaran(true);

      await api.post("/pembayaran", {
        orderId: orderId,
        jumlah: jumlah,
        metode: metodePembayaran,
        penerimaKasirId: user.id,
      });

      Alert.alert("Berhasil", "Pembayaran berhasil diproses.");

      const response = await api.get(`/order/${orderId}`);

      setOrderDetail(response.data.data);
      setJumlahDibayar("");
    } catch (error: any) {
      console.log("error pembayaran");
      console.log(error);

      console.log("status error:", error.response?.status);
      console.log("data error:", error.response?.data);

      Alert.alert(
        "Pembayaran Gagal",
        error.response?.data?.message ||
          "Terjadi kesalahan saat memproses pembayaran.",
      );
    } finally {
      setProsesPembayaran(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F3E4C9]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#0A2947"
          />

          <Text className="text-[#8B5E3C] mt-4 text-base">
            Memuat detail order...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!orderDetail) {
    return (
      <SafeAreaView className="flex-1 bg-[#F3E4C9]">
        <View className="flex-1 px-5">
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

            <View className="ml-4">
              <Text className="text-2xl font-bold text-[#0A2947]">
                Detail Order
              </Text>

              <Text className="text-[#8B5E3C] mt-1">Informasi pesanan</Text>
            </View>
          </View>

          <View className="flex-1 items-center justify-center">
            <View className="bg-white rounded-2xl p-6 w-full items-center">
              <View className="w-16 h-16 rounded-full bg-[#F3E4C9] items-center justify-center">
                <Ionicons
                  name="receipt-outline"
                  size={32}
                  color="#8B5E3C"
                />
              </View>

              <Text className="text-xl font-bold text-[#0A2947] mt-4">
                Order Tidak Ditemukan
              </Text>

              <Text className="text-gray-500 text-center mt-2">
                Data order yang kamu cari tidak tersedia.
              </Text>

              <Pressable
                onPress={() => navigation.goBack()}
                className="bg-[#8B5E3C] rounded-xl py-3 px-6 mt-5">
                <Text className="text-white font-bold">Kembali</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const totalPembayaran = Number(orderDetail.total);

  const uangDiterima = Number(jumlahDibayar) || 0;

  const kembalian =
    uangDiterima > totalPembayaran ? uangDiterima - totalPembayaran : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9] ">
      <FlatList
        data={orderDetail.pesanMenu}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
        ListHeaderComponent={
          <View>
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
                  Detail Order
                </Text>

                <Text className="text-[#8B5E3C] mt-1">
                  Informasi lengkap pesanan
                </Text>
              </View>

              <View className="w-11 h-11 rounded-full bg-[#0A2947] items-center justify-center">
                <Ionicons
                  name="receipt-outline"
                  size={23}
                  color="#F3E4C9"
                />
              </View>
            </View>

            <View className="bg-white rounded-2xl p-5 mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-[#F3E4C9] items-center justify-center">
                  <Ionicons
                    name="receipt"
                    size={24}
                    color="#8B5E3C"
                  />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-xs text-[#8B5E3C]">Kode Order</Text>

                  <Text className="text-xl font-bold text-[#0A2947] mt-1">
                    {orderDetail.orderKode}
                  </Text>
                </View>
              </View>

              <View className="border-t border-[#D3D4C0] mt-4 pt-4">
                <View className="flex-row items-center">
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color="#8B5E3C"
                  />

                  <Text className="text-gray-500 ml-2">Pelanggan</Text>

                  <Text className="text-[#0A2947] font-semibold ml-auto">
                    {orderDetail.pelanggan.nama}
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-5 mb-4">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-[#F3E4C9] items-center justify-center">
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#8B5E3C"
                  />
                </View>

                <Text className="text-lg font-bold text-[#0A2947] ml-3">
                  Status Pesanan
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-500">Status Order</Text>

                <View className="bg-[#F3E4C9] px-3 py-2 rounded-full">
                  <Text className="font-bold text-[#8B5E3C] text-xs">
                    {orderDetail.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500">Pembayaran</Text>

                <View
                  className={`px-3 py-2 rounded-full ${
                    orderDetail.statusPembayaran === "SUDAH_DIBAYAR"
                      ? "bg-[#D3D4C0]"
                      : "bg-gray-200"
                  }`}>
                  <Text className="font-bold text-[#0A2947] text-xs">
                    {orderDetail.statusPembayaran}
                  </Text>
                </View>
              </View>

              {orderDetail.status === "MENUNGGU" && (
                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-5"
                  onPress={() => updateStatusOrder("DIKONFIRMASI")}
                  disabled={updateStatus}>
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={19}
                      color="#FFFFFF"
                    />

                    <Text className="text-white text-center font-bold ml-2">
                      {updateStatus ? "Mengubah..." : "Konfirmasi Pesanan"}
                    </Text>
                  </View>
                </Pressable>
              )}

              {orderDetail.status === "DIKONFIRMASI" && (
                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-5"
                  onPress={() => updateStatusOrder("DISIAPKAN")}
                  disabled={updateStatus}>
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name="restaurant-outline"
                      size={19}
                      color="#FFFFFF"
                    />

                    <Text className="text-white text-center font-bold ml-2">
                      {updateStatus ? "Mengubah..." : "Siapkan Pesanan"}
                    </Text>
                  </View>
                </Pressable>
              )}

              {orderDetail.status === "DISIAPKAN" && (
                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-5"
                  onPress={() => updateStatusOrder("SIAP")}
                  disabled={updateStatus}>
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name="checkmark-done-outline"
                      size={19}
                      color="#FFFFFF"
                    />

                    <Text className="text-white text-center font-bold ml-2">
                      {updateStatus ? "Mengubah..." : "Pesanan Siap"}
                    </Text>
                  </View>
                </Pressable>
              )}

              {orderDetail.status === "SIAP" && (
                <Pressable
                  className="bg-[#8B5E3C] rounded-xl py-3 mt-5"
                  onPress={() => updateStatusOrder("SELESAI")}
                  disabled={updateStatus}>
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={19}
                      color="#FFFFFF"
                    />

                    <Text className="text-white text-center font-bold ml-2">
                      {updateStatus ? "Mengubah..." : "Selesaikan Pesanan"}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>

            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full bg-[#0A2947] items-center justify-center">
                <Ionicons
                  name="fast-food-outline"
                  size={21}
                  color="#F3E4C9"
                />
              </View>

              <Text className="text-xl font-bold text-[#0A2947] ml-3">
                Daftar Pesanan
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white px-5 py-4 rounded-2xl mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-[#F3E4C9] items-center justify-center">
                <Ionicons
                  name="restaurant-outline"
                  size={20}
                  color="#8B5E3C"
                />
              </View>

              <View className="flex-1 ml-3">
                <Text className="text-base font-bold text-[#0A2947]">
                  {item.menu.menu}
                </Text>

                <Text className="text-gray-500 mt-1">
                  {item.jumlah} x Rp{" "}
                  {Number(item.hargaSnapshot).toLocaleString("id-ID")}
                </Text>
              </View>

              <Text className="font-bold text-[#0A2947]">
                Rp {Number(item.subTotal).toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View>
            <View className="bg-white rounded-2xl p-5 mt-1">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-[#F3E4C9] items-center justify-center">
                  <Ionicons
                    name="calculator-outline"
                    size={21}
                    color="#8B5E3C"
                  />
                </View>

                <Text className="text-lg font-bold text-[#0A2947] ml-3">
                  Ringkasan Pembayaran
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500">Subtotal</Text>

                <Text className="text-[#0A2947]">
                  Rp {Number(orderDetail.subTotal).toLocaleString("id-ID")}
                </Text>
              </View>

              <View className="flex-row justify-between mb-4">
                <Text className="text-gray-500">Diskon</Text>

                <Text className="text-[#0A2947]">
                  Rp {Number(orderDetail.diskon).toLocaleString("id-ID")}
                </Text>
              </View>

              <View className="border-t border-[#D3D4C0] pt-4 flex-row justify-between">
                <Text className="font-bold text-lg text-[#0A2947]">Total</Text>

                <Text className="font-bold text-lg text-[#8B5E3C]">
                  Rp {Number(orderDetail.total).toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            {orderDetail.statusPembayaran === "BELUM_DIBAYAR" && (
              <View className="bg-white rounded-2xl p-5 mt-4">
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 rounded-full bg-[#F3E4C9] items-center justify-center">
                    <Ionicons
                      name="card-outline"
                      size={21}
                      color="#8B5E3C"
                    />
                  </View>

                  <Text className="text-lg font-bold text-[#0A2947] ml-3">
                    Pembayaran
                  </Text>
                </View>

                <Text className="font-semibold text-[#0A2947] mb-2">
                  Metode Pembayaran
                </Text>

                <Pressable
                  className="border border-[#D3D4C0] rounded-xl px-4 py-3 flex-row justify-between items-center"
                  onPress={() => setShowMetode(!showMetode)}>
                  <Text className="text-base text-[#0A2947]">
                    {metodePembayaran === "CASH"
                      ? "CASH (TUNAI)"
                      : metodePembayaran}
                  </Text>

                  <Ionicons
                    name={showMetode ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#8B5E3C"
                  />
                </Pressable>

                {showMetode && (
                  <View className="border border-[#D3D4C0] rounded-xl mt-2 overflow-hidden">
                    <Pressable
                      className="px-4 py-3"
                      onPress={() => {
                        setMetodePembayaran("CASH");
                        setShowMetode(false);
                      }}>
                      <Text className="text-[#0A2947]">CASH (TUNAI)</Text>
                    </Pressable>

                    <Pressable
                      className="px-4 py-3 border-t border-[#D3D4C0]"
                      onPress={() => {
                        setMetodePembayaran("QRIS");
                        setShowMetode(false);
                      }}>
                      <Text className="text-[#0A2947]">QRIS</Text>
                    </Pressable>

                    <Pressable
                      className="px-4 py-3 border-t border-[#D3D4C0]"
                      onPress={() => {
                        setMetodePembayaran("TRANSFER");
                        setShowMetode(false);
                      }}>
                      <Text className="text-[#0A2947]">TRANSFER</Text>
                    </Pressable>
                  </View>
                )}

                <Text className="font-semibold text-[#0A2947] mt-4 mb-2">
                  Jumlah Uang Diterima
                </Text>

                <TextInput
                  className="border border-[#D3D4C0] rounded-xl px-4 py-3 text-base text-[#0A2947]"
                  placeholder="Masukkan jumlah uang"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={jumlahDibayar}
                  onChangeText={setJumlahDibayar}
                />

                <View className="bg-[#F3E4C9] rounded-xl px-4 py-3 mt-4 flex-row justify-between items-center">
                  <Text className="text-[#0A2947]">Kembalian</Text>

                  <Text className="text-[#8B5E3C] font-bold">
                    Rp {kembalian.toLocaleString("id-ID")}
                  </Text>
                </View>

                <Pressable
                  className="bg-[#8B5E3C] rounded-xl py-4 mt-5"
                  onPress={prosesBayar}
                  disabled={prosesPembayaran}>
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name="card-outline"
                      size={19}
                      color="#FFFFFF"
                    />

                    <Text className="text-white text-center font-bold ml-2">
                      {prosesPembayaran ? "Memproses..." : "Bayar Sekarang"}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={() => navigation.goBack()}
              className="bg-[#0A2947] rounded-xl py-4 mt-5">
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="arrow-back"
                  size={19}
                  color="#FFFFFF"
                />

                <Text className="text-white font-bold ml-2">Kembali</Text>
              </View>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}
