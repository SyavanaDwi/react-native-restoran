import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";

import { useEffect, useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/types";

import api from "../services/api";

import { order } from "../types/order";

import { userAuthStore } from "../stores/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "DetailOrder">;

export default function DetailOrder({ route }: Props) {
  const { orderId } = route.params;

  const [orderDetail, setOrderDetail] = useState<order | null>(null);

  const [loading, setLoading] = useState(true);

  const [updateStatus, setUpdateStatus] = useState(false);

  // PEMBAYARAN
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

  // UPDATE STATUS ORDER
  const updateStatusOrder = async (status: string) => {
    try {
      setUpdateStatus(true);

      await api.patch(`/order/status/${orderId}`, {
        status: status,
      });

      console.log("status berhasil diubah");

      const response = await api.get(`/order/${orderId}`);

      setOrderDetail(response.data.data);
    } catch (error: any) {
      console.log("error update status");
      console.log(error);

      console.log("status error:", error.response?.status);
      console.log("data error:", error.response?.data);
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
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator
          size="large"
          color="#0A2947"
        />

        <Text className="text-gray-500 mt-4 text-base">
          Memuat detail order...
        </Text>
      </View>
    );
  }

  if (!orderDetail) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <View className="bg-white rounded-2xl p-6 w-full items-center">
          <Text className="text-xl font-bold text-[#0A2947] mb-2">
            Order Tidak Ditemukan
          </Text>

          <Text className="text-gray-500 text-center">
            Data order yang kamu cari tidak tersedia.
          </Text>
        </View>
      </View>
    );
  }

  const totalPembayaran = Number(orderDetail.total);

  const uangDiterima = Number(jumlahDibayar) || 0;

  const kembalian =
    uangDiterima > totalPembayaran ? uangDiterima - totalPembayaran : 0;

  return (
    <View className="my-5 mx-4">
      <FlatList
        data={orderDetail.pesanMenu}
        keyExtractor={(item) => item.id.toString()}

        ListHeaderComponent={
          <View>
            <View className="mb-5">
              <Text className="text-2xl font-bold text-[#0A2947]">
                {orderDetail.orderKode}
              </Text>

              <View className="flex-row gap-3">
                <Text className="text-lg font-bold text-[#0A2947]">
                  Pelanggan:
                </Text>

                <Text className="text-gray-700">
                  {orderDetail.pelanggan.nama}
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-5 mb-4">
              <Text className="text-lg font-bold text-[#0A2947] mb-3">
                Status
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Status Order</Text>

                <Text className="font-semibold text-[#0A2947]">
                  {orderDetail.status}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-500">Pembayaran</Text>

                <Text className="font-semibold text-[#0A2947]">
                  {orderDetail.statusPembayaran}
                </Text>
              </View>

              {orderDetail.status === "MENUNGGU" && (
                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-4"
                  onPress={() => updateStatusOrder("DIKONFIRMASI")}
                  disabled={updateStatus}>
                  <Text className="text-white text-center font-bold">
                    {updateStatus ? "Mengubah..." : "Konfirmasi Pesanan"}
                  </Text>
                </Pressable>
              )}

              {orderDetail.status === "DIKONFIRMASI" && (
                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-4"
                  onPress={() => updateStatusOrder("DISIAPKAN")}
                  disabled={updateStatus}>
                  <Text className="text-white text-center font-bold">
                    {updateStatus ? "Mengubah..." : "Siapkan Pesanan"}
                  </Text>
                </Pressable>
              )}

              {orderDetail.status === "DISIAPKAN" && (
                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-4"
                  onPress={() => updateStatusOrder("SIAP")}
                  disabled={updateStatus}>
                  <Text className="text-white text-center font-bold">
                    {updateStatus ? "Mengubah..." : "Pesanan Siap"}
                  </Text>
                </Pressable>
              )}

              {/* SIAP → SELESAI */}
              {orderDetail.status === "SIAP" && (
                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-4"
                  onPress={() => updateStatusOrder("SELESAI")}
                  disabled={updateStatus}>
                  <Text className="text-white text-center font-bold">
                    {updateStatus ? "Mengubah..." : "Selesaikan Pesanan"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }

        // DAFTAR PESANAN
        renderItem={({ item }) => (
          <View className="bg-white px-5 py-3 rounded-xl mb-2">
            <Text className="text-lg font-bold text-[#0A2947] mb-3">
              Pesanan
            </Text>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="font-semibold text-base">
                  {item.menu.menu}
                </Text>

                <Text className="text-gray-500 mt-1">
                  {item.jumlah} x Rp{" "}
                  {Number(item.hargaSnapshot).toLocaleString("id-ID")}
                </Text>
              </View>

              <Text className="font-semibold">
                Rp {Number(item.subTotal).toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        )}

        ListFooterComponent={
          <View>
            {/* RINGKASAN PEMBAYARAN */}
            <View className="bg-white rounded-2xl p-5 mt-4">
              <Text className="text-lg font-bold text-[#0A2947] mb-4">
                Ringkasan Pembayaran
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Subtotal</Text>

                <Text>
                  Rp {Number(orderDetail.subTotal).toLocaleString("id-ID")}
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500">Diskon</Text>

                <Text>
                  Rp {Number(orderDetail.diskon).toLocaleString("id-ID")}
                </Text>
              </View>

              <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="font-bold text-lg">Total</Text>

                <Text className="font-bold text-lg text-[#0A2947]">
                  Rp {Number(orderDetail.total).toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            {orderDetail.statusPembayaran === "BELUM_DIBAYAR" && (
              <View className="bg-white rounded-2xl p-5 mt-4">
                <Text className="text-lg font-bold text-[#0A2947] mb-4">
                  Pembayaran
                </Text>

                <Text className="font-semibold mb-2">Metode Pembayaran</Text>

                <Pressable
                  className="border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                  onPress={() => setShowMetode(!showMetode)}>
                  <Text className="text-base">
                    {metodePembayaran === "CASH"
                      ? "CASH (TUNAI)"
                      : metodePembayaran}
                  </Text>

                  <Text className="text-gray-500">
                    {showMetode ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {showMetode && (
                  <View className="border border-gray-200 rounded-xl mt-2 overflow-hidden">
                    <Pressable
                      className="px-4 py-3"
                      onPress={() => {
                        setMetodePembayaran("CASH");
                        setShowMetode(false);
                      }}>
                      <Text>CASH (TUNAI)</Text>
                    </Pressable>

                    <Pressable
                      className="px-4 py-3 border-t border-gray-200"
                      onPress={() => {
                        setMetodePembayaran("QRIS");
                        setShowMetode(false);
                      }}>
                      <Text>QRIS</Text>
                    </Pressable>

                    <Pressable
                      className="px-4 py-3 border-t border-gray-200"
                      onPress={() => {
                        setMetodePembayaran("TRANSFER");
                        setShowMetode(false);
                      }}>
                      <Text>TRANSFER</Text>
                    </Pressable>
                  </View>
                )}

                <Text className="font-semibold mt-4 mb-2">
                  Jumlah Uang Diterima
                </Text>

                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3 text-base"
                  placeholder="Masukkan jumlah uang"
                  keyboardType="numeric"
                  value={jumlahDibayar}
                  onChangeText={setJumlahDibayar}
                />

                <View className="bg-slate-100 rounded-lg px-3 py-3 mt-4 flex-row justify-between">
                  <Text className="text-[#0A2947]">Kembalian:</Text>

                  <Text className="text-green-600 font-bold">
                    Rp {kembalian.toLocaleString("id-ID")}
                  </Text>
                </View>

                <Pressable
                  className="bg-[#0A2947] rounded-xl py-3 mt-5"
                  onPress={prosesBayar}
                  disabled={prosesPembayaran}>
                  <Text className="text-white text-center font-bold">
                    {prosesPembayaran ? "Memproses..." : "Bayar Sekarang"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        }
      />
    </View>
  );
}
