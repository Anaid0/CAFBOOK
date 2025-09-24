// app/navigation/StackNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from '../../components/Map'; // Asegúrate de que la ruta sea correcta

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

export default Navigation;
