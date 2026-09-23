import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import api from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { userAuthStore } from "../stores/authStore";
import * as SecureStore from "expo-secure-store";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setUser = userAuthStore((state) => state.setUser);

  const login = async () => {
    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      console.log("login berhasil");

      const token = response.data.token;
      const user = response.data.data;

      await SecureStore.setItemAsync("token", token);

      console.log("token berhasil disimpan");

      setUser(user);

      navigation.replace("Home");
    } catch (error) {
      console.log("error pada login");
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="justify-center px-6">
        <Text className="text-2xl font-bold mb-6">Login</Text>

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          className="bg-blue-900 rounded-lg py-3"
          onPress={login}>
          <Text className="text-white text-center font-bold">Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
