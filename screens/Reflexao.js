import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoCustomizado from '../components/BotaoCustomizado';
import { Modal } from 'react-native';

const STORAGE_KEY = '@reflexoes';

export default function Reflexao() {
  const [reflexoes, setReflexoes] = useState([]);
  const [novaReflexao, setNovaReflexao] = useState('');
  const [humor, setHumor] = useState('');

  const [reflexaoParaExcluir, setReflexaoParaExcluir] = useState(null);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);

  const opcoesHumor = [
    { emoji: '😄', label: 'Feliz' },
    { emoji: '😔', label: 'Triste' },
    { emoji: '🤔', label: 'Pensativo' },
    { emoji: '😠', label: 'Bravo' },
    { emoji: '😴', label: 'Cansado' },
    { emoji: '😐', label: 'Neutro' },
  ];

  // 💡 Lista de sugestões baseadas no humor
  const sugestoesPorHumor = {
    '😄': [
      'Aproveite essa energia! Escreva uma cena curta inspirada em uma memória boa!',
      'Transforme sua felicidade em palavras! Crie um diálogo divertido entre seus personagens favoritos!',
      'Sua inspiração está em alta! Que tal criar algo novo? Um capítulo ou uma história nova, você decide!',
      'Quando compartilhada, a alegria é multiplicada. Escreva uma cena onde a felicidade de alguém contamina todos ao redor.',
      'Transforme pequenos detalhes felizes em narrativa: um cheiro, uma música ou um pôr do sol podem virar cena.',
    ],
    '😔': [
      'Tudo bem não estar 100%. Escreva sobre o que sente, sem filtros.',
      'Mesmo a tristeza pode gerar belas histórias. Experimente escrever uma poesia curta.',
      'Lembre-se: até os dias nublados podem inspirar. Faça uma pausa, respire e tome um café.',
      'Use a tristeza como lente: descreva a cidade, a natureza ou o ambiente de um jeito que reflita seu sentimento.',
      'Escreva um único parágrafo. Então, reflita: talvez seja possível criar algo da melancolia.',
    ],
    '🤔': [
      'Escrever é um jeito de se conhecer melhor. Experimente!',
      'Que tal inovar? Anote suas ideias mais estranhas; alguma pode virar um ótimo enredo.',
      'Hoje pode ser um bom dia para refletir sobre as pontas soltas de suas histórias.',
      'Explore uma de suas dúvidas intrigantes e tranforme-a em parte da história.',
      'Escreva sobre uma escolha difícil que um personagem poderia enfrentar.',
      'Pergunte-se: ‘O que aconteceria se…?’ e transforme isso em uma cena ou diálogo.',
    ],
    '😠': [
      'Canalize a raiva em algo produtivo: desenvolva um personagem intenso, como um vilão.',
      'A escrita pode ser terapêutica, uma forma de liberar o que te incomoda. Expresse o que está sentindo!',
      'Escreva uma cena de confronto ou tensão entre seus personagens.',
      'Explore a frustração como motivação para uma virada dramática na história.',
      'Transforme a energia negativa em movimento, como uma cena cheia de ação.',
    ],
    '😴': [
      'Você fez bem até aqui! Dê uma pausa; o tempo ajuda a maturar suas ideias.',
      'As melhores ideias às vezes surgem de sonhos. Descanse bem!',
      'Revise algo simples, sem pressa; pequenos passos também contam.',
      'A energia baixa não significa bloqueio, apenas sinal de cuidar de si.',
      'Ouça uma música suave e deixe sua mente se reconectar.',
    ],
    '😐': [
      'Aproveite para conectar ideias que estavam dispersas.',
      'Escreva sem pressa. O ritmo tranquilo também é inspiração.',
      'Talvez seja um bom momento para organizar pensamentos e criar estrutura.',
      'Cada palavra é um passo — o importante é começar.',
      'Um estado neutro permite olhar para suas criações com objetividade.',
    ],
  };

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
    const dataHora = `${agora.toLocaleDateString()} ${agora.toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit' }
    )}`;

    const opcaoSelecionada = opcoesHumor.find((o) => o.emoji === humor);
    const humorExibicao = opcaoSelecionada
      ? `${opcaoSelecionada.emoji} - ${opcaoSelecionada.label}`
      : '😶 - Indefinido';

    const novaEntrada = {
      dataHora,
      humor: humorExibicao,
      emoji: humor || '😶',
      texto,
    };

    setReflexoes((prev) => [novaEntrada, ...prev]);
    setNovaReflexao('');
    setHumor('');
  };

  // Gerar sugestão aleatória
  const gerarSugestao = () => {
    let emojiAtual = 'default';

    if (reflexoes.length > 0) {
      // Pega o último humor registrado
      const ultima = reflexoes[0];
      if (ultima.emoji && sugestoesPorHumor[ultima.emoji]) {
        emojiAtual = ultima.emoji;
      }
    }

    const lista = sugestoesPorHumor[emojiAtual] || sugestoesPorHumor.default;
    const sugestao = lista[Math.floor(Math.random() * lista.length)];
    Alert.alert('💡 Sugestão do Dia!', sugestao);
  };

  const excluirReflexao = () => {
    if (!reflexaoParaExcluir) return;
    setReflexoes((prev) => prev.filter((r) => r !== reflexaoParaExcluir));
    setReflexaoParaExcluir(null);
    setModalExcluirVisivel(false);
  };

  <Modal
    visible={modalExcluirVisivel}
    transparent
    animationType="fade"
    onRequestClose={() => setModalExcluirVisivel(false)}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitulo}>Deseja excluir esta reflexão?</Text>
        <View style={styles.centered}>
          <BotaoCustomizado
            title="Confirmar Exclusão"
            onPress={excluirReflexao}
          />
          <TouchableOpacity onPress={() => setModalExcluirVisivel(false)}>
            <Text style={{ color: '#999', marginTop: 10 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>;
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
            onPress={() => setHumor(opcao.emoji)}>
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
        <BotaoCustomizado
          title="Registrar Reflexão"
          onPress={adicionarReflexao}
        />
      </View>

      <ScrollView style={styles.lista}>
        {reflexoes.map((r, i) => (
          <View key={i} style={styles.reflexaoContainer}>
            <TouchableOpacity
              onPress={() => {
                setReflexaoParaExcluir(r);
                setModalExcluirVisivel(true);
              }}
              style={styles.botaoLixeira}>
              <Entypo name="trash" size={20} color="#4A148C" />
            </TouchableOpacity>

            <Text style={styles.dataHora}>{r.dataHora}</Text>
            <Text style={styles.humor}>{r.humor}</Text>
            <Text style={styles.texto}>{r.texto}</Text>
          </View>
        ))}
      </ScrollView>

      {reflexoes.length > 0 && (
        <TouchableOpacity style={styles.botaoSugestao} onPress={gerarSugestao}>
          <Text style={styles.iconeLampada}>💡</Text>
          <Text style={styles.textoSugestao}>Sugestão do Dia!</Text>
        </TouchableOpacity>
      )}
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
  emoji: { fontSize: 28 },
  input: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  areaTexto: { minHeight: 100, textAlignVertical: 'top' },
  centered: { alignItems: 'center', marginBottom: 15 },
  lista: { marginTop: 15, marginBottom: 70 },
  reflexaoContainer: {
    backgroundColor: '#f5f3fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  dataHora: { fontWeight: '600', color: '#4A148C', marginBottom: 4 },
  humor: { fontStyle: 'italic', color: '#6C5B7B', marginBottom: 6 },
  texto: { color: '#333' },
  // 💡 Estilo do botão "Sugestão do Dia!"
  botaoSugestao: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#B39DDB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  iconeLampada: { fontSize: 20, marginRight: 8 },
  textoSugestao: { color: '#fff', fontWeight: '600', fontSize: 16 },
  botaoLixeira: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
