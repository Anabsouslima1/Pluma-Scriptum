import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import CriarObra from './screens/CriarObra';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
         <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="CriarObra" component={CriarObra} options={{ title: 'Modo de Escrita' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
