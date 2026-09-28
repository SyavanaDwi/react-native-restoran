import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useEffect, useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import api from "../services/api";
import { userAuthStore } from "../stores/authStore";
import { Menu } from "../types/menu";
import { Pelanggan } from "../types/pelanngan";

type Props = NativeStackScreenProps<RootStackParamList, "NewOrder">;

export default function NewOrder({ navigation }: Props) {
  const user = userAuthStore((state) => state.user);

  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);

  const [selectedPelangganId, setSelectedPelangganId] = useState<number | null>(
    null,
  );

  const [selectedPelanggan, setSelectedPelanggan] = useState<Pelanggan | null>(
    null,
  );

  const [pelangganSearch, setPelangganSearch] = useState("");
  const [menuSearch, setMenuSearch] = useState("");

  const [showPelanggan, setShowPelanggan] = useState(false);

  const [cart, setCart] = useState<(Menu & { jumlah: number })[]>([]);

  const [diskonPersen, setDiskonPersen] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [menuResponse, pelangganResponse] = await Promise.all([
          api.get("/menu"),
          api.get("/pelanggan"),
        ]);

        setMenuList(menuResponse.data);

        setPelangganList(pelangganResponse.data?.data || []);
      } catch (error) {
        console.log("error mengambil data NewOrder");
        console.log(error);

        Alert.alert("Gagal", "Gagal mengambil data menu dan pelanggan.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectPelanggan = (pelanggan: Pelanggan) => {
    setSelectedPelangganId(pelanggan.id);
    setSelectedPelanggan(pelanggan);

    setPelangganSearch(`${pelanggan.nama} (${pelanggan.nomer_hp})`);

    setShowPelanggan(false);

    if (pelanggan.member && pelanggan.member.statusMember) {
      setDiskonPersen(Number(pelanggan.member.diskon) || 0);
    } else {
      setDiskonPersen(0);
    }
  };

  const filteredPelanggan = useMemo(() => {
    const keyword = pelangganSearch.toLowerCase().trim();

    return pelangganList
      .filter((pelanggan) => pelanggan.statusPelanggan !== false)
      .filter((pelanggan) => {
        if (!keyword) {
          return true;
        }

        return (
          pelanggan.nama.toLowerCase().includes(keyword) ||
          pelanggan.nomer_hp.includes(keyword)
        );
      });
  }, [pelangganList, pelangganSearch]);

  const filteredMenu = useMemo(() => {
    const keyword = menuSearch.toLowerCase().trim();

    return menuList
      .filter((menu) => menu.statusMenu !== false)
      .filter((menu) => {
        if (!keyword) {
          return true;
        }

        return (
          menu.menu.toLowerCase().includes(keyword) ||
          menu.kategori.toLowerCase().includes(keyword)
        );
      });
  }, [menuList, menuSearch]);

  const handleAddToCart = (menu: Menu) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menu.id);

      if (existing) {
        return prev.map((item) =>
          item.id === menu.id
            ? {
                ...item,
                jumlah: item.jumlah + 1,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...menu,
          jumlah: 1,
        },
      ];
    });
  };

  const handleUpdateQty = (menuId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== menuId) {
            return item;
          }

          const newQty = item.jumlah + delta;

          if (newQty <= 0) {
            return null;
          }

          return {
            ...item,
            jumlah: newQty,
          };
        })
        .filter((item): item is Menu & { jumlah: number } => item !== null),
    );
  };

  const subTotal = cart.reduce(
    (total, item) => total + Number(item.harga) * item.jumlah,
    0,
  );

  const potonganDiskon = (subTotal * diskonPersen) / 100;

  const total = Math.max(0, subTotal - potonganDiskon);

  const handleSubmit = async () => {
    if (!selectedPelangganId) {
      Alert.alert("Pelanggan", "Pilih pelanggan terlebih dahulu.");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Keranjang Kosong", "Tambahkan minimal satu menu.");
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
      setSubmitting(true);

      const payload = {
        pelangganId: selectedPelangganId,

        kasirId: user.id,

        items: cart.map((item) => ({
          menuId: item.id,
          jumlah: item.jumlah,
          harga: Number(item.harga),
        })),

        diskon: potonganDiskon,
      };

      const response = await api.post("/order", payload);

      console.log("order berhasil dibuat", response.data);

      const newOrderId = response.data?.data?.id;

      Alert.alert("Berhasil", "Pesanan berhasil dibuat.", [
        {
          text: "Lihat Pesanan",
          onPress: () => {
            if (newOrderId) {
              navigation.replace("DetailOrder", {
                orderId: newOrderId,
              });
            } else {
              navigation.goBack();
            }
          },
        },
      ]);
    } catch (error: any) {
      console.log("error membuat order");
      console.log(error);

      Alert.alert(
        "Gagal Membuat Pesanan",
        error.response?.data?.message ||
          "Terjadi kesalahan saat membuat pesanan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator
          size="large"
          color="#0A2947"
        />

        <Text className="text-gray-500 mt-4">Memuat data pesanan...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 my-4 mx-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-[#D3D4C0]">
          <View className="flex-row items-center">
            <View className="ml-3 flex-1">
              <Text className="text-xl font-bold text-[#0A2947]">
                Buat Order Baru
              </Text>

              <Text className="text-gray-500 text-sm mt-1">
                Pilih pelanggan dan menu untuk membuat pesanan
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl mt-5 border border-[#D3D4C0]">
          <View className="p-5 border-b border-gray-200">
            <Text className="text-base font-bold text-[#0A2947]">
              1. Pilih Pelanggan
            </Text>
          </View>

          <View className="p-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Cari Pelanggan
            </Text>

            <TextInput
              className="border border-[#D3D4C0] rounded-xl px-4 py-3 text-sm"
              placeholder="Nama atau nomor HP..."
              placeholderTextColor="#9CA3AF"
              value={pelangganSearch}
              onChangeText={(text) => {
                setPelangganSearch(text);
                setShowPelanggan(true);

                if (!text) {
                  setSelectedPelangganId(null);
                  setSelectedPelanggan(null);
                  setDiskonPersen(0);
                }
              }}
              onFocus={() => setShowPelanggan(true)}
            />

            {showPelanggan && (
              <View className="border border-[#D3D4C0] rounded-xl mt-2 overflow-hidden">
                {filteredPelanggan.length === 0 ? (
                  <View className="p-4">
                    <Text className="text-gray-500 text-center">
                      Pelanggan tidak ditemukan
                    </Text>
                  </View>
                ) : (
                  filteredPelanggan.slice(0, 8).map((pelanggan) => (
                    <Pressable
                      key={pelanggan.id}
                      className="px-4 py-3 border-b border-gray-100"
                      onPress={() => handleSelectPelanggan(pelanggan)}>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                          <Text className="font-semibold text-[#0A2947]">
                            {pelanggan.nama}
                          </Text>

                          <Text className="text-gray-500 text-xs mt-1">
                            {pelanggan.nomer_hp}
                          </Text>
                        </View>

                        {pelanggan.member && pelanggan.member.statusMember && (
                          <View className="bg-emerald-100 px-2 py-1 rounded-full">
                            <Text className="text-emerald-700 text-xs font-bold">
                              Member {pelanggan.member.diskon}%
                            </Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  ))
                )}
              </View>
            )}

            {selectedPelanggan && (
              <View className="bg-[#F3E4C9]/30 rounded-xl p-4 mt-4">
                <Text className="text-xs text-gray-500">
                  Pelanggan terpilih
                </Text>

                <Text className="font-bold text-[#0A2947] mt-1">
                  {selectedPelanggan.nama}
                </Text>

                <Text className="text-gray-500 text-sm mt-1">
                  {selectedPelanggan.nomer_hp}
                </Text>

                {selectedPelanggan.member &&
                  selectedPelanggan.member.statusMember && (
                    <Text className="text-emerald-700 font-semibold text-sm mt-2">
                      Member - Diskon {diskonPersen}%
                    </Text>
                  )}
              </View>
            )}
          </View>
        </View>

        {/* MENU */}
        <View className="bg-white rounded-2xl mt-5 border border-[#D3D4C0] overflow-hidden">
          <View className="bg-[#0A2947] p-5">
            <Text className="text-base font-bold text-white">
              2. Pilih Menu Makanan
            </Text>

            <TextInput
              className="bg-white rounded-xl px-4 py-3 mt-4 text-sm"
              placeholder="Cari menu atau kategori..."
              placeholderTextColor="#9CA3AF"
              value={menuSearch}
              onChangeText={setMenuSearch}
            />
          </View>

          <View className="p-4">
            {filteredMenu.length === 0 ? (
              <View className="py-6">
                <Text className="text-gray-500 text-center">
                  Menu tidak ditemukan
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {filteredMenu.map((menu) => (
                  <View
                    key={menu.id}
                    className="border border-[#D3D4C0]/70 rounded-xl p-3 mb-3 bg-white"
                    style={{
                      width: "48%",
                    }}>
                    <View>
                      <View className="self-start bg-[#F3E4C9]/60 px-2 py-1 rounded-full">
                        <Text className="text-[#8B5E3C] text-[10px] font-bold">
                          {menu.kategori}
                        </Text>
                      </View>

                      <Text
                        className="font-bold text-[#0A2947] mt-2"
                        numberOfLines={1}>
                        {menu.menu}
                      </Text>

                      <Text className="text-gray-500 text-xs mt-1">
                        {menu.deskripsi || ""}
                      </Text>
                    </View>

                    <View className="border-t border-gray-100 mt-3 pt-3">
                      <Text className="font-bold text-gray-800 text-sm mb-2">
                        Rp {Number(menu.harga).toLocaleString("id-ID")}
                      </Text>

                      <Pressable
                        className="bg-[#0A2947] rounded-lg py-2"
                        onPress={() => handleAddToCart(menu)}>
                        <Text className="text-white text-center text-xs font-bold">
                          + Tambah
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View className="bg-white rounded-2xl mt-5 border border-[#D3D4C0] overflow-hidden">
          <View className="bg-[#F3E4C9]/30 p-5 border-b border-gray-200">
            <Text className="text-base font-bold text-[#0A2947]">
              Ringkasan Order
            </Text>
          </View>

          <View className="p-5">
            {cart.length === 0 ? (
              <View className="py-6">
                <Text className="text-gray-500 text-center">
                  Keranjang belanja masih kosong
                </Text>
              </View>
            ) : (
              <View>
                {cart.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <View className="flex-1">
                      <Text className="font-semibold text-[#0A2947]">
                        {item.menu}
                      </Text>

                      <Text className="text-gray-500 text-xs mt-1">
                        Rp {Number(item.harga).toLocaleString("id-ID")}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Pressable
                        className="border border-[#D3D4C0] rounded-lg w-8 h-8 items-center justify-center"
                        onPress={() => handleUpdateQty(item.id, -1)}>
                        <Text className="text-[#0A2947] font-bold">
                          {item.jumlah === 1 ? "×" : "−"}
                        </Text>
                      </Pressable>

                      <Text className="font-bold text-[#0A2947] w-8 text-center">
                        {item.jumlah}
                      </Text>

                      <Pressable
                        className="border border-[#D3D4C0] rounded-lg w-8 h-8 items-center justify-center"
                        onPress={() => handleUpdateQty(item.id, 1)}>
                        <Text className="text-[#0A2947] font-bold">+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* SUBTOTAL */}
            <View className="border-t border-gray-200 pt-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Subtotal</Text>

                <Text className="font-semibold text-gray-800">
                  Rp {subTotal.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            {/* DISKON */}
            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Diskon (%)
              </Text>

              <TextInput
                className="border border-[#D3D4C0] rounded-xl px-4 py-3"
                keyboardType="numeric"
                value={String(diskonPersen)}
                onChangeText={(text) => {
                  const value = Number(text);

                  if (value < 0) {
                    setDiskonPersen(0);
                    return;
                  }

                  if (value > 100) {
                    setDiskonPersen(100);
                    return;
                  }

                  setDiskonPersen(Number.isNaN(value) ? 0 : value);
                }}
              />
            </View>

            {/* POTONGAN */}
            <View className="flex-row justify-between mt-4">
              <Text className="text-emerald-700 font-medium">
                Potongan Diskon
              </Text>

              <Text className="text-emerald-700 font-medium">
                - Rp {potonganDiskon.toLocaleString("id-ID")}
              </Text>
            </View>

            {/* TOTAL */}
            <View className="border-t border-gray-200 pt-4 mt-3">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-[#0A2947]">
                  Total Bayar
                </Text>

                <Text className="text-lg font-bold text-[#0A2947]">
                  Rp {total.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            {/* SUBMIT */}
            <Pressable
              className={`rounded-xl py-4 mt-5 ${
                submitting || cart.length === 0 ? "bg-gray-400" : "bg-[#0A2947]"
              }`}
              onPress={handleSubmit}
              disabled={submitting || cart.length === 0}>
              <Text className="text-white text-center font-bold">
                {submitting ? "Memproses..." : "Submit Order"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
