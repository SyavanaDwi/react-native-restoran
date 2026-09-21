import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-3 pt-5">
        <Text className="text-2xl font-bold text-gray-900">
          Daftar menu restoran
        </Text>
      </View>

      <Text className="mt-2 px-3 text-gray-900">
        Semua daftar menu restoran saya
      </Text>
    </SafeAreaView>
  );
}
