import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import api from "../services/api";
import { RootStackParamList } from "../navigation/types";
import { Pelanggan } from "../types/pelanngan";

type Props = NativeStackScreenProps<RootStackParamList, "MainTab">;

export default function PelangganScreen({ navigation }: Props) {
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getPelanggan = async () => {
    try {
      setLoading(true);

      const response = await api.get("/pelanggan");

      setPelanggan(response.data.data || []);
    } catch (error: any) {
      console.log("gagal mengambil pelanggan");
      console.log("STATUS:", error?.response?.status);
      console.log("DATA:", error?.response?.data);
      console.log("ERROR:", error);

      Alert.alert(
        "Gagal",
        error?.response?.data?.message || "Gagal mengambil data pelanggan",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPelanggan();
  }, []);

  const toggleMember = async (item: Pelanggan) => {
    try {
      if (!item.member) {
        const generatedKode = `MBR-${Date.now().toString().slice(-6)}`;

        await api.post("/member", {
          pelangganId: Number(item.id),
          memberKode: generatedKode,
          diskon: 10,
          statusMember: true,
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
      console.log("gagal mengubah status member");
      console.log("STATUS:", error?.response?.status);
      console.log("DATA:", error?.response?.data);
      console.log("ERROR:", error);

      Alert.alert(
        "Gagal",
        error?.response?.data?.message || "Gagal mengubah status member",
      );
    }
  };

  const toggleBlacklist = async (item: Pelanggan) => {
    try {
      const statusBaru = !item.statusPelanggan;

      await api.patch(`/pelanggan/${item.id}/blacklist`, {
        statusPelanggan: statusBaru,
      });

      await getPelanggan();

      Alert.alert(
        "Berhasil",
        statusBaru
          ? `${item.nama} berhasil diaktifkan`
          : `${item.nama} berhasil di-blacklist`,
      );
    } catch (error: any) {
      console.log("gagal mengubah status pelanggan");
      console.log("STATUS:", error?.response?.status);
      console.log("DATA:", error?.response?.data);
      console.log("ERROR:", error);

      Alert.alert(
        "Gagal",
        error?.response?.data?.message || "Gagal mengubah status pelanggan",
      );
    }
  };

  const filteredPelanggan = pelanggan.filter(
    (item: Pelanggan) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nomer_hp.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Pelanggan }) => {
    const memberAktif = item.member?.statusMember === true;

    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          padding: 18,
          marginBottom: 14,
          elevation: 3,
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#0A2947",
              }}>
              {item.nama}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: item.statusPelanggan ? "#D3D4C0" : "#F3D0D0",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: item.statusPelanggan ? "#40513B" : "#9B3333",
              }}>
              {item.statusPelanggan ? "Aktif" : "Blacklist"}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#EEEEEE",
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 7,
            }}>
            <Ionicons
              name="call-outline"
              size={17}
              color="#8B5E3C"
            />

            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                color: "#555",
              }}>
              {item.nomer_hp || "-"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
            }}>
            <Ionicons
              name="location-outline"
              size={17}
              color="#8B5E3C"
            />

            <Text
              style={{
                marginLeft: 8,
                flex: 1,
                fontSize: 14,
                color: "#555",
              }}>
              {item.alamat || "-"}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#EEEEEE",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <View>
            {item.member ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <Ionicons
                    name="person-circle-outline"
                    size={18}
                    color="#8B5E3C"
                  />

                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#8B5E3C",
                    }}>
                    {item.member.memberKode}
                  </Text>
                </View>

                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: "600",
                    color: memberAktif ? "#3D7A46" : "#999",
                  }}>
                  {memberAktif ? "Member Aktif" : "Member Tidak Aktif"}
                </Text>

                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 12,
                    color: "#777",
                  }}>
                  Diskon: {item.member.diskon}%
                </Text>
              </>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#999"
                />

                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#777",
                  }}>
                  Pelanggan Reguler
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={() => toggleMember(item)}
            style={{
              backgroundColor: item.member
                ? memberAktif
                  ? "#F3D0D0"
                  : "#D3D4C0"
                : "#8B5E3C",
              paddingHorizontal: 13,
              paddingVertical: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: item.member
                  ? memberAktif
                    ? "#9B3333"
                    : "#40513B"
                  : "#FFFFFF",
              }}>
              {item.member
                ? memberAktif
                  ? "Nonaktifkan"
                  : "Aktifkan"
                : "Jadikan Member"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => toggleBlacklist(item)}
          style={{
            marginTop: 12,
            borderWidth: 1,
            borderColor: item.statusPelanggan ? "#E5B7B7" : "#B9C2A8",
            paddingVertical: 9,
            borderRadius: 10,
            alignItems: "center",
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: item.statusPelanggan ? "#9B3333" : "#40513B",
            }}>
            {item.statusPelanggan
              ? "Blacklist Pelanggan"
              : "Aktifkan Pelanggan"}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "#F3E4C9",
      }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <View>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: "#0A2947",
            }}>
            Pelanggan
          </Text>

          <Text
            style={{
              marginTop: 3,
              fontSize: 13,
              color: "#666",
            }}>
            Kelola pelanggan dan member
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate("CreatePelanggan")}
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: "#8B5E3C",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Ionicons
            name="person-add-outline"
            size={23}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 14,
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          height: 46,
        }}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#777"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Cari pelanggan..."
          placeholderTextColor="#999"
          style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 14,
            color: "#333",
          }}
        />
      </View>

      <FlatList
        data={filteredPelanggan}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={getPelanggan}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getPelanggan}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
