import * as React from 'react';
import {
  TextInput,
  Text,
  View,
  Button,
  StyleSheet,
  TouchableHighlight,
  Image,
  SafeAreaView,
} from 'react-native';
import BotaoCustomizado from '../components/BotaoCustomizado';

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Logo + Título */}
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Pluma Scriptum</Text>
        <Text style={styles.subtitle}>Seu espaço criativo de escrita!</Text>
      </View>

      {/* Botões */}
      <View style={styles.buttonsContainer}>
        <BotaoCustomizado title="Modo de Escrita" onPress={() => navigation.navigate('CriarObra')} />
        <BotaoCustomizado title="Modo Reflexão" onPress={() => navigation.navigate('Reflexao')} />
        <BotaoCustomizado title="Construção de Mundo" onPress={() => navigation.navigate('ConstrucaoMundo')}/>
        <BotaoCustomizado title="Diários de Personagem" onPress={() => {}} />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center', 
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    marginTop: 100
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C5B7B',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 30,
  },
});


