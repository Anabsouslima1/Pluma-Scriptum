import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';

export default function Sobre() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground 
        source={require('../assets/writer.jpg')} 
        style={styles.background} 
        imageStyle={{ opacity: 0.3, transform: [{ translateX: 38}] }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.centroTopo}>
            <Text style={styles.titulo}>Sobre o Pluma Scriptum</Text>

            <Text style={styles.texto}>
            Pluma Scriptum é um espaço criativo voltado à organização da escrita para escritores.
            </Text>

            <Text style={styles.texto}>
            Isso permite que o artista possa:
            </Text>

            <Text style={styles.item}>• Criar e gerenciar obras de escrita.</Text>
            <Text style={styles.item}>• Desenvolver personagens completos.</Text>
            <Text style={styles.item}>• Refletir sobre personagens e diários temáticos.</Text>
            <Text style={styles.item}>• Construir mundos detalhados para suas histórias.</Text>

            <Text style={styles.assinatura}>
             Desenvolvido com 💛{"\n"} por Ana Lima
            </Text>
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
        alignItems: 'center'
    },
    centroTopo: {
        width: '100%',
        marginTop: 1, 
        alignItems: 'center',
        paddingHorizontal:15      
    },
    texto: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
        lineHeight: 22,
        textAlign: 'justify',       
    },
    item: {
        fontSize: 16,
        color: '#4A3F35',
        marginBottom: 8,
        textAlign: 'center',     
    },

    titulo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#4A148C',
        textAlign: 'center',
        marginBottom: 20,
    },
    assinatura: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'serif',          
        fontStyle: 'italic',        
        letterSpacing: 0.5,           
        textShadowColor: 'rgba(0,0,0,0.1)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        marginTop: 20,
        }
});
