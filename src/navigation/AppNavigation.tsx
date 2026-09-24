import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import DetailMenu from "../screens/DetailMenuScreen";
import LoginScreen from "../screens/LoginScreen";
import DetailOrder from "../screens/DetailOrderScreen";
import NewOrderSreen from "../screens/NewOrderScreen";

import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
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
