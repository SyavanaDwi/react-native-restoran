import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

import api from "../services/api";
import { RootStackParamList } from "../navigation/types";
import { userAuthStore } from "../stores/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = userAuthStore((state) => state.setUser);

  const login = async () => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.data;

      await SecureStore.setItemAsync("token", token);

      setUser(user);

      navigation.replace("MainTab");
    } catch (error: any) {
      console.log("error pada login");
      console.log(error?.response?.data || error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3E4C9]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? "height" : "padding"}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 120,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <View className="min-h-full">
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-[#0A2947] items-center justify-center mb-5">
                <Ionicons
                  name="restaurant-outline"
                  size={40}
                  color="#F3E4C9"
                />
              </View>

              <Text className="text-3xl font-bold text-[#0A2947]">
                Restoran
              </Text>

              <Text className="text-[#8B5E3C] mt-2">Staff Management</Text>
            </View>

            <View className="bg-white rounded-3xl p-6">
              <Text className="text-2xl font-bold text-[#0A2947] mb-2">
                Selamat Datang
              </Text>

              <Text className="text-gray-500 mb-6">
                Silakan login untuk melanjutkan
              </Text>

              <View className="mb-4">
                <Text className="text-[#0A2947] font-semibold mb-2">Email</Text>

                <View className="flex-row items-center border border-[#D3D4C0] rounded-xl px-4">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#8B5E3C"
                  />

                  <TextInput
                    className="flex-1 ml-3 py-3 text-[#0A2947]"
                    placeholder="Masukkan email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-[#0A2947] font-semibold mb-2">
                  Password
                </Text>

                <View className="flex-row items-center border border-[#D3D4C0] rounded-xl px-4">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#8B5E3C"
                  />

                  <TextInput
                    className="flex-1 ml-3 py-3 text-[#0A2947]"
                    placeholder="Masukkan password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <Pressable
                onPress={login}
                disabled={loading}
                className="bg-[#0A2947] rounded-xl py-4">
                <View className="flex-row items-center justify-center">
                  {loading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />

                      <Text className="text-white font-bold ml-2">
                        Loading...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="log-in-outline"
                        size={21}
                        color="#FFFFFF"
                      />

                      <Text className="text-white font-bold text-base ml-2">
                        Login
                      </Text>
                    </>
                  )}
                </View>
              </Pressable>
            </View>

            <Text className="text-center text-[#8B5E3C] text-xs mt-6">
              Restaurant Staff Application
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
