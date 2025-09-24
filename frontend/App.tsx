import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/registerScreen";
import ForgotPasswordScreen from "./app/screens/forgotPasswordScreen";
import CodigoPasswordScreen from "./app/screens/codigoPassword";
import BottomTabNavigator from "./app/navigation/bottomTabNavigator";
import MisTutorialesScreen from './app/screens/misTutorialesScreen';
import MisManualesScreen from './app/screens/misManualesScreen';
import MisForosScreen from './app/screens/misForosScreen';
import AgregarScreen from "./app/screens/agregarScreen";
import CultivosScreen from "./app/screens/cultivosScreen";
import homeScreen from "./app/screens/homeScreen";
import EditProfileUser from "./app/screens/editProfileUser";
import ProfileScreenUser from "./app/screens/profileScreenUser";
import MiMuroScreen from "./app/screens/MiMuroScreen";
import EditarPostScreen from "./app/screens/editPost";
import ManualDetailScreen from "./app/screens/ManualDetailScreen";
import MisTelefonosScreen from "./app/screens/misTelefonosScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CodigoPassword" component={CodigoPasswordScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="MisTutoriales" component={MisTutorialesScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="MisManuales" component={MisManualesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MisForos" component={MisForosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="agregarScreen" component={AgregarScreen} />
        <Stack.Screen name="cultivosScreen" component={CultivosScreen} />
        <Stack.Screen name="homeScreen" component={homeScreen} />
        <Stack.Screen name="EditProfileUser" component={EditProfileUser} />
        <Stack.Screen name="ProfileScreenUser" component={ProfileScreenUser} />
        <Stack.Screen name="MiMuroScreen" component={MiMuroScreen} />
        <Stack.Screen name="EditarPostScreen" component={EditarPostScreen} />
        <Stack.Screen name="ManualDetailScreen" component={ManualDetailScreen} />
        <Stack.Screen name="MisTelefonosScreen" component={MisTelefonosScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}