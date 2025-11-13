import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';

export default function Sobre() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground 
        source={require('../assets/writer.jpg')} 
        style={styles.background} 
        imageStyle={{ opacity: 0.3, transform: [{ translateX: 38 }] }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.centroTopo}>
            <Text style={styles.titulo}>Sobre o Pluma Scriptum</Text>

            <Text style={styles.texto}>
              É um espaço dedicado à escrita criativa, 
              projetado para ajudar autores a organizarem suas ideias e desenvolverem suas obras com liberdade e inspiração.
            </Text>

            <Text style={styles.texto}>
              Além de planejar histórias, é possível explorar aspectos fundamentais da criação literária — 
              como construção de mundos, desenvolvimento de personagens e registros de ideias ou emoções que acompanham o processo criativo.
            </Text>

            <View style={styles.assinaturaContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.assinaturaLinha1}>Desenvolvido com </Text>
              <Text>💛</Text>
            </View>
            <Text style={styles.assinaturaLinha2}>por Ana Lima</Text>
          </View>


            

          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    padding: 15,
  },
  overlay: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 20,
    alignItems: 'center',
  },
  centroTopo: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 8,
  },
  texto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    lineHeight: 24,
    textAlign: 'justify',
  },
  assinaturaContainer: {
    position: 'absolute',
    top: 380,
    left: 125,
    alignSelf: 'center',
    alignItems: 'center',
  },
  assinaturaLinha1: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'System',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  assinaturaLinha2: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'System',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginTop: 2,
  }
});
