import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoCustomizado from '../components/BotaoCustomizado';

const STORAGE_KEY = '@reflexoes';

export default function Reflexao() {
  const [reflexoes, setReflexoes] = useState([]);
  const [novaReflexao, setNovaReflexao] = useState('');
  const [humor, setHumor] = useState('');

  const opcoesHumor = [
    { emoji: '😄', label: 'Feliz' },
    { emoji: '😔', label: 'Triste' },
    { emoji: '🤔', label: 'Pensativo' },
    { emoji: '😠', label: 'Bravo' },
    { emoji: '😴', label: 'Cansado' },
    { emoji: '😌', label: 'Calmo' },
  ];

  // Carregar reflexões salvas
  useEffect(() => {
    (async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) setReflexoes(JSON.parse(dados));
      } catch (e) {
        console.log('Erro ao carregar reflexões:', e);
      }
    })();
  }, []);

  // Salvar reflexões automaticamente
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reflexoes));
      } catch (e) {
        console.log('Erro ao salvar reflexões:', e);
      }
    })();
  }, [reflexoes]);

  const adicionarReflexao = () => {
    const texto = novaReflexao.trim();
    if (!texto) return;

    const agora = new Date();
    const dataHora = `${agora.toLocaleDateString()} ${agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // encontra a label do humor selecionado
    const opcaoSelecionada = opcoesHumor.find((o) => o.emoji === humor);
    const humorExibicao = opcaoSelecionada
      ? `${opcaoSelecionada.emoji} - ${opcaoSelecionada.label}`
      : '😶 - Indefinido';

    const novaEntrada = {
      dataHora,
      humor: humorExibicao,
      texto,
    };

    setReflexoes((prev) => [novaEntrada, ...prev]);
    setNovaReflexao('');
    setHumor('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Modo Reflexão</Text>
      <Text style={styles.subtitulo}>
        Espaço pessoal para registrar emoções e bloqueios criativos
      </Text>

      <Text style={styles.pergunta}>Como você está se sentindo hoje?</Text>
      <View style={styles.humorContainer}>
        {opcoesHumor.map((opcao) => (
          <TouchableOpacity
            key={opcao.label}
            style={[
              styles.emojiBotao,
              humor === opcao.emoji && styles.emojiSelecionado,
            ]}
            onPress={() => setHumor(opcao.emoji)}
          >
            <Text style={styles.emoji}>{opcao.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[styles.input, styles.areaTexto]}
        multiline
        placeholder="Escreva sua reflexão ou progresso criativo..."
        value={novaReflexao}
        onChangeText={setNovaReflexao}
      />

      <View style={styles.centered}>
        <BotaoCustomizado title="Registrar Reflexão" onPress={adicionarReflexao} />
      </View>

      <ScrollView style={styles.lista}>
        {reflexoes.map((r, i) => (
          <View key={i} style={styles.reflexaoContainer}>
            <Text style={styles.dataHora}>{r.dataHora}</Text>
            <Text style={styles.humor}>{r.humor}</Text>
            <Text style={styles.texto}>{r.texto}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: '#6C5B7B',
    textAlign: 'center',
    marginBottom: 20,
  },
  pergunta: {
    fontSize: 16,
    color: '#4A148C',
    fontWeight: '600',
    marginBottom: 10,
  },
  humorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emojiBotao: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f2e7fe',
  },
  emojiSelecionado: {
    backgroundColor: '#B39DDB',
  },
  emoji: {
    fontSize: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  areaTexto: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  centered: { alignItems: 'center', marginBottom: 15 },
  lista: { marginTop: 15 },
  reflexaoContainer: {
    backgroundColor: '#f5f3fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  dataHora: {
    fontWeight: '600',
    color: '#4A148C',
    marginBottom: 4,
  },
  humor: {
    fontStyle: 'italic',
    color: '#6C5B7B',
    marginBottom: 6,
  },
  texto: {
    color: '#333',
  },
});
