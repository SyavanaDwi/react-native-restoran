import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { Pelanggan } from "../types/pelanngan";
import { RootStackParamList } from "../navigation/types";
import api from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "MainTab">;

export default function PelangganScreen({ navigation }: Props) {
  const [pelangganResto, setPelanggan] = useState<Pelanggan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPelanggan();
  }, []);

  const getPelanggan = async () => {
    try {
      const pelanggan = await api.get("/pelanggan");
      setPelanggan(pelanggan.data.data);
    } catch (error) {
      console.log("gagal menampilkan data pelanggan");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = async (item: Pelanggan) => {
    try {
      if (!item.member) {
        await api.post("/member", {
          pelangganId: item.id,
          diskon: 0,
        });

        await getPelanggan();

        Alert.alert(
          "Berhasil",
          `${item.nama} berhasil didaftarkan sebagai member`,
        );

        return;
      }

      const statusBaru = !item.member.statusMember;

      await api.put(`/member/${item.member.id}`, {
        statusMember: statusBaru,
      });

      await getPelanggan();

      Alert.alert(
        "Berhasil",
        statusBaru
          ? `${item.nama} sekarang menjadi member aktif`
          : `${item.nama} sekarang menjadi member tidak aktif`,
      );
    } catch (error: any) {
      console.log("gagal mengubah status member", error);

      Alert.alert(
        "Gagal",
        error?.response?.data?.message || "Gagal mengubah status member",
      );
    }
  };

  const filterSearch = pelangganResto.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nama?.toLowerCase().includes(keyword) ||
      item.nomer_hp?.toLowerCase().includes(keyword)
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
            Memuat daftar pelanggan...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9] mt-5">
      <View className="flex-1 px-5">
        <View className="flex-row items-center pt-2 pb-5">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-[#0A2947]">
              Daftar Pelanggan
            </Text>

            <Text className="text-[#8B5E3C] mt-1">
              Kelola pelanggan dan member
            </Text>
          </View>

          <View className="w-11 h-11 rounded-full bg-[#0A2947] items-center justify-center">
            <Ionicons
              name="people-outline"
              size={23}
              color="#F3E4C9"
            />
          </View>
        </View>

        <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center mb-4">
          <Ionicons
            name="search-outline"
            size={21}
            color="#8B5E3C"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari pelanggan..."
            placeholderTextColor="#999"
            className="flex-1 ml-3 text-[#0A2947]"
          />
        </View>

        <FlatList
          data={filterSearch}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          ListEmptyComponent={
            <View className="bg-white rounded-2xl p-6 items-center">
              <View className="w-16 h-16 rounded-full bg-[#F3E4C9] items-center justify-center">
                <Ionicons
                  name="people-outline"
                  size={30}
                  color="#8B5E3C"
                />
              </View>

              <Text className="text-[#0A2947] font-bold text-lg mt-4">
                Pelanggan tidak ditemukan
              </Text>

              <Text className="text-gray-500 text-center mt-2">
                Tidak ada pelanggan yang sesuai dengan pencarian.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const memberAktif = item.member?.statusMember === true;

            return (
              <View className="bg-white rounded-2xl p-5 mb-4">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-full bg-[#F3E4C9] items-center justify-center">
                    <Ionicons
                      name="person"
                      size={23}
                      color="#8B5E3C"
                    />
                  </View>

                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-bold text-[#0A2947]">
                      {item.nama}
                    </Text>

                    <View className="flex-row items-center mt-1">
                      <Ionicons
                        name="call-outline"
                        size={14}
                        color="#8B5E3C"
                      />

                      <Text className="text-gray-500 ml-2">
                        {item.nomer_hp || "-"}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`px-3 py-1 rounded-full ${
                      item.statusPelanggan ? "bg-[#D3D4C0]" : "bg-gray-200"
                    }`}>
                    <Text className="text-[#0A2947] text-xs font-bold">
                      {item.statusPelanggan ? "Aktif" : "Blacklist"}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-[#D3D4C0] mt-4 pt-4">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#8B5E3C"
                    />

                    <Text className="text-gray-600 ml-2 flex-1">
                      {item.alamat || "-"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-4">
                  <View
                    className={`px-3 py-2 rounded-full ${
                      !item.member
                        ? "bg-gray-200"
                        : memberAktif
                          ? "bg-[#D3D4C0]"
                          : "bg-gray-200"
                    }`}>
                    <Text className="text-[#0A2947] text-xs font-bold">
                      {!item.member
                        ? "Bukan Member"
                        : memberAktif
                          ? "Member Aktif"
                          : "Member Tidak Aktif"}
                    </Text>
                  </View>
                </View>

                {!item.member && (
                  <Pressable
                    onPress={() => toggleMember(item)}
                    className="bg-[#0A2947] rounded-xl py-3 mt-4">
                    <View className="flex-row items-center justify-center">
                      <Ionicons
                        name="person-add-outline"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text className="text-white font-bold ml-2">
                        Daftarkan Sebagai Member
                      </Text>
                    </View>
                  </Pressable>
                )}

                {item.member && (
                  <Pressable
                    onPress={() => toggleMember(item)}
                    className={`rounded-xl py-3 mt-4 ${
                      memberAktif ? "bg-[#8B5E3C]" : "bg-[#0A2947]"
                    }`}>
                    <View className="flex-row items-center justify-center">
                      <Ionicons
                        name={
                          memberAktif
                            ? "close-circle-outline"
                            : "checkmark-circle-outline"
                        }
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text className="text-white font-bold ml-2">
                        {memberAktif ? "Nonaktifkan Member" : "Aktifkan Member"}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
