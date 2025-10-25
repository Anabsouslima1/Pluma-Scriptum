import * as React from 'react';
import { TextInput, Text, View, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home'

const Navegacao = createBottomTabNavigator();

class App extends React.Component {

  render() {
    return(
    <NavigationContainer>
      <Navegacao.Navigator>
        <Navegacao.Screen name="Home" component={Home}/>
      </Navegacao.Navigator>
    </NavigationContainer>
    )
  }
}



export default App;