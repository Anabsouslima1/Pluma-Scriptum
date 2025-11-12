import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import CriarObra from './screens/CriarObra';
import ConstrucaoMundo from './screens/ConstrucaoMundo'; 
import Reflexao from './screens/Reflexao';
import Diario from './screens/Diario';
import CriarPersonagem from './screens/CriarPersonagem';
import Sobre from './screens/Sobre';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="CriarObra" component={CriarObra} options={{ title: 'Modo de Escrita' }} />
        <Stack.Screen name="ConstrucaoMundo" component={ConstrucaoMundo} options={{ title: 'Construção de Mundo' }} />
        <Stack.Screen name="Reflexao" component={Reflexao} options={{ title: 'Modo Reflexão' }} />
        <Stack.Screen name="CriarPersonagem" component={CriarPersonagem} options={{ title: 'Criação de Personagem' }} />
        <Stack.Screen name="Diario" component={Diario} options={{ title: 'Diários de Personagem' }} />
        <Stack.Screen name="Sobre" component={Sobre} options={{ title: 'Sobre' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
