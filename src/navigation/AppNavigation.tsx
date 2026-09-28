import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import DetailMenu from "../screens/DetailMenuScreen";
import LoginScreen from "../screens/LoginScreen";
import DetailOrder from "../screens/DetailOrderScreen";
import NewOrderSreen from "../screens/NewOrderScreen";
import PelangganScreen from "../screens/PelangganScreen";
import HistoryOrderScreen from "../screens/HistoryOrderScreen";
import CreatePelangganScreen from "../screens/CreatePelangganScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

import { RootStackParamList, BottomTabParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0A2947",
        tabBarInactiveTintColor: "#8B5E3C",
        tabBarStyle: {
          backgroundColor: "#F3E4C9",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 72,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "CreatePelanggan") {
            return (
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  backgroundColor: "#8B5E3C",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -22,
                  borderWidth: 5,
                  borderColor: "#f4d9a7",
                }}>
                <Ionicons
                  name="person-add"
                  size={28}
                  color="white"
                />
              </View>
            );
          }

          let iconName:
            | "home"
            | "home-outline"
            | "restaurant"
            | "restaurant-outline"
            | "receipt"
            | "receipt-outline"
            | "people"
            | "people-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Menu") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "History") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else {
            iconName = focused ? "people" : "people-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryOrderScreen}
        options={{
          title: "Histori",
        }}
      />

      <Tab.Screen
        name="CreatePelanggan"
        component={CreatePelangganScreen}
        options={{
          title: "",
        }}
      />

      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          title: "Menu",
        }}
      />

      <Tab.Screen
        name="Pelanggan"
        component={PelangganScreen}
        options={{
          title: "Pelanggan",
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DetailMenu"
        component={DetailMenu}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DetailOrder"
        component={DetailOrder}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="NewOrder"
        component={NewOrderSreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
