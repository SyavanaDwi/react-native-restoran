import { View, Text, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "DetailMenu">;

export default function DetailMenu({ navigation, route }: Props) {
  const { menuId, nama, harga } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-5">
        <Text className="text-2xl font-bold text-gray-900">Detail menu</Text>
        <View className="rounded-2xl bg-gray-100 p-6">
          <Text className="text-m font-semibold text-gray-900">
            Menu ID: {menuId}
          </Text>
          <Text className="mt-3 text-m text-gray-900">Nama Menu: {nama}</Text>
          <Text className="text-m text-gray-900">
            harga: Rp {harga.toLocaleString("id-ID")}
          </Text>

          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-6 rounded-xl bg-black px-6 py-4">
            <Text className="text-center font-semibold text-white">
              kembali
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
