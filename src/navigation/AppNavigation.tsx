import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import DetailMenu from "../screens/DetailMenuScreen";
import LoginScreen from "../screens/LoginScreen";
import DetailOrder from "../screens/DetailOrderScreen";
import NewOrderSreen from "../screens/NewOrderScreen";

import { RootStackParamList, BottomTabParamList } from "./types";
import PelangganScreen from "../screens/PelangganScreen";
import HistoryOrderScreen from "../screens/HistoryOrderScreen";
import CreatePelangganScreen from "../screens/CreatePelangganScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: "Home",
        }}
      />

      <Tab.Screen
        name="HistoryOrder"
        component={HistoryOrderScreen}
        options={{ headerShown: false, title: "Histori Order" }}
      />

      <Tab.Screen
        name="CreatePelanggan"
        component={CreatePelangganScreen}
        options={{ headerShown: false, title: "pelanggan baru" }}
      />

      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          title: "Menu",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Pelanggan"
        component={PelangganScreen}
        options={{ headerShown: false, title: "Kelola Member" }}
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
      />

      <Stack.Screen
        name="DetailOrder"
        component={DetailOrder}
      />

      <Stack.Screen
        name="NewOrder"
        component={NewOrderSreen}
      />
    </Stack.Navigator>
  );
}
