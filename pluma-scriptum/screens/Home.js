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
import firebase from '../config/config';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pluma Scriptum</Text>
        <Text style={styles.subtitle}>Seu espaço criativo de escrita!</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <BotaoCustomizado title="Modo de Escrita" onPress={() => {}} />
        <BotaoCustomizado title="Modo Reflexão" onPress={() => {}} />
        <BotaoCustomizado title="Construção de Mundo" onPress={() => {}} />
        <BotaoCustomizado title="Diários de Personagem" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFCFB",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2E1F27",
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    color: "#6C5B7B",
    marginTop: 8,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
});
