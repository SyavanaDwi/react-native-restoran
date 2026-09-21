import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-5">
        <Text className="text-2xl font-bold text-gray-900">Hai, Syavana</Text>

        <Text className="mt-2 text-gray-500">
          Selamat datang di aplikasi restoran
        </Text>

        <Pressable
          onPress={() => navigation.navigate("Menu")}
          className="mt-6 rounded-xl bg-black px-5 py-4">
          <Text className="text-center font-semibold text-white">
            Lihat Menu
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
