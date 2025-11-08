import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoCustomizado from '../components/BotaoCustomizado';

const STORAGE_KEY = '@diariosPersonagem';

// Prompts reflexivos que você pode personalizar
const prompts = [
  "Qual é o maior medo do seu personagem?",
  "O que faz seu personagem sorrir genuinamente?",
  "Qual segredo ele guarda e por quê?",
  "Como ele reage sob pressão?",
  "Qual é o maior sonho do seu personagem?",
  "Como ele lida com perdas ou fracassos?",
  "O que ele mais valoriza na vida?",
  "Como ele descreveria seu próprio temperamento?",
];

export default function Diario() {
  const [diarios, setDiarios] = useState([]);
  const [novoDiario, setNovoDiario] = useState('');
  const [promptAtual, setPromptAtual] = useState('');

  // Carregar diários salvos
  useEffect(() => {
    (async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) setDiarios(JSON.parse(dados));
      } catch (e) {
        console.log('Erro ao carregar diários:', e);
      }
    })();
    gerarPrompt(); // seleciona o primeiro prompt ao abrir a tela
  }, []);

  // Salvar diários automaticamente
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(diarios));
      } catch (e) {
        console.log('Erro ao salvar diários:', e);
      }
    })();
  }, [diarios]);

  const gerarPrompt = () => {
    const aleatorio = prompts[Math.floor(Math.random() * prompts.length)];
    setPromptAtual(aleatorio);
  };

  const adicionarDiario = () => {
    const texto = novoDiario.trim();
    if (!texto) return;

    const agora = new Date();
    const dataHora = `${agora.toLocaleDateString()} ${agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const novaEntrada = {
      dataHora,
      prompt: promptAtual,
      texto,
    };

    setDiarios((prev) => [novaEntrada, ...prev]);
    setNovoDiario('');
    gerarPrompt(); // gera novo prompt aleatório para a próxima entrada
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Diários de Personagem</Text>
      <Text style={styles.subtitulo}>
        Crie perfis de personagens com campos personalizáveis e aprofunde a personalidade deles.
      </Text>

      <Text style={styles.prompt}>💡 Pergunta: {promptAtual}</Text>

      <TextInput
        style={[styles.input, styles.areaTexto]}
        multiline
        placeholder="Escreva sua resposta..."
        value={novoDiario}
        onChangeText={setNovoDiario}
      />

      <View style={styles.centered}>
        <BotaoCustomizado title="Registrar Entrada" onPress={adicionarDiario} />
        <BotaoCustomizado title="Gerar Outra Pergunta" onPress={gerarPrompt} />
      </View>

      <ScrollView style={styles.lista}>
        {diarios.map((d, i) => (
          <View key={i} style={styles.diarioContainer}>
            <Text style={styles.dataHora}>{d.dataHora}</Text>
            <Text style={styles.prompt}>💡 {d.prompt}</Text>
            <Text style={styles.texto}>{d.texto}</Text>
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
  prompt: {
    fontSize: 16,
    color: '#4A148C',
    fontWeight: '600',
    marginBottom: 10,
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
  diarioContainer: {
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
  texto: {
    color: '#333',
  },
});
