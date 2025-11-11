import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoCustomizado from '../components/BotaoCustomizado';
import { Modal, TouchableOpacity } from 'react-native';

const STORAGE_KEY = '@diariosPersonagem';

const temas = {
  Geral: [
    'Qual é o maior medo do seu personagem?',
    'O que faz seu personagem sorrir genuinamente?',
    'Qual segredo ele guarda e por quê?',
  ],
  Emoções: [
    'Como ele reage sob pressão?',
    'Como ele lida com perdas ou fracassos?',
  ],
  Sonhos: [
    'Qual é o maior sonho do seu personagem?',
    'O que ele mais valoriza na vida?',
  ],
};

export default function Diario() {
  const [diarios, setDiarios] = useState([]);
  const [novoDiario, setNovoDiario] = useState('');
  const [promptAtual, setPromptAtual] = useState('');
  const [personagemSelecionado, setPersonagemSelecionado] = useState('');
  const [temaSelecionado, setTemaSelecionado] = useState('Geral');

  const [modalVisivel, setModalVisivel] = useState(false);
  const [perguntaLivre, setPerguntaLivre] = useState('');

  const [personagens, setPersonagens] = useState([]);

  const [diarioParaExcluir, setDiarioParaExcluir] = useState(null);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);

  const [sound, setSound] = React.useState();

  async function tocarSom() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/plim.wav')
    );
    setSound(sound);
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const carregarPersonagens = async () => {
      try {
        const dados = await AsyncStorage.getItem('@personagens');
        if (dados) {
          const lista = JSON.parse(dados);
          setPersonagens(lista);
        }
      } catch (e) {
        console.log('Erro ao carregar personagens:', e);
      }
    };

    carregarPersonagens();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) setDiarios(JSON.parse(dados));
      } catch (e) {
        console.log('Erro ao carregar diários:', e);
      }
    })();
    gerarPrompt();
  }, []);

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
    const perguntas = temas[temaSelecionado] || temas['Geral'];
    const aleatorio = perguntas[Math.floor(Math.random() * perguntas.length)];
    setPromptAtual(aleatorio);
  };

  const adicionarDiario = () => {
    const texto = novoDiario.trim();
    if (!texto || !personagemSelecionado) return;

    const agora = new Date();
    const dataHora = `${agora.toLocaleDateString()} ${agora.toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit' }
    )}`;

    const novaEntrada = {
      personagem: personagemSelecionado,
      dataHora,
      prompt: promptAtual,
      texto,
    };

    setDiarios((prev) => [novaEntrada, ...prev]);
    setNovoDiario('');
    gerarPrompt();

    Alert.alert('Sucesso', 'Registrado com sucesso ✨');
  };

  const excluirDiario = () => {
    if (!diarioParaExcluir) return;
    setDiarios((prev) => prev.filter((d) => d !== diarioParaExcluir));
    setDiarioParaExcluir(null);
    setModalExcluirVisivel(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          flexGrow: 1,
          backgroundColor: '#fff',
        }}>
        <Text style={styles.titulo}>Diários de Personagem</Text>
        <Text style={styles.subtitulo}>
          Selecione um personagem e mergulhe em seu diário!
        </Text>

        <Text style={styles.label}>Personagem:</Text>
        <Picker
          selectedValue={personagemSelecionado}
          onValueChange={(itemValue) => setPersonagemSelecionado(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Selecione um personagem" value="" />
          {personagens.map((p, i) => (
            <Picker.Item key={i} label={p.nome} value={p.nome} />
          ))}
        </Picker>

        <Text style={styles.separador}>Registros Diários</Text>

        <Text style={styles.label}>Tema:</Text>
        <Picker
          selectedValue={temaSelecionado}
          onValueChange={(itemValue) => {
            setTemaSelecionado(itemValue);
            gerarPrompt();
          }}
          style={styles.picker}>
          {Object.keys(temas).map((tema, i) => (
            <Picker.Item key={i} label={tema} value={tema} />
          ))}
        </Picker>

        <Text style={styles.prompt}>💡 Pergunta: {promptAtual}</Text>

        <TextInput
          style={[styles.input, styles.areaTexto]}
          multiline
          placeholder="Escreva sua resposta..."
          value={novoDiario}
          onChangeText={setNovoDiario}
        />

        <View style={styles.centered}>
          <BotaoCustomizado
            title="Registrar Entrada"
            onPress={() => {
              adicionarDiario();
              tocarSom();
            }}
          />
          <BotaoCustomizado
            title="Gerar Outra Pergunta"
            onPress={gerarPrompt}
          />
          <BotaoCustomizado
            title="Pergunta Livre"
            onPress={() => setModalVisivel(true)}
          />
        </View>

        <Modal
          visible={modalExcluirVisivel}
          transparent
          animationType="fade"
          onRequestClose={() => setModalExcluirVisivel(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitulo}>
                Deseja excluir esta entrada?
              </Text>
              <View style={styles.centered}>
                <BotaoCustomizado
                  title="Confirmar Exclusão"
                  onPress={excluirDiario}
                />
                <TouchableOpacity onPress={() => setModalExcluirVisivel(false)}>
                  <Text style={{ color: '#999', marginTop: 10 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalVisivel}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisivel(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitulo}>
                Digite sua pergunta estilizada:
              </Text>
              <TextInput
                style={[styles.input, styles.areaTexto]}
                value={perguntaLivre}
                onChangeText={setPerguntaLivre}
              />
              <View style={styles.centered}>
                <BotaoCustomizado
                  title="Usar Pergunta"
                  onPress={() => {
                    if (perguntaLivre.trim()) {
                      setPromptAtual(perguntaLivre.trim());
                      setPerguntaLivre('');
                      setModalVisivel(false);
                    }
                  }}
                />
                <TouchableOpacity onPress={() => setModalVisivel(false)}>
                  <Text style={{ color: '#999', marginTop: 10 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {personagemSelecionado ? (
          diarios
            .filter((d) => d.personagem === personagemSelecionado)
            .map((d, i) => (
              <View key={i} style={styles.diarioContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setDiarioParaExcluir(d);
                    setModalExcluirVisivel(true);
                  }}
                  style={styles.botaoLixeira}>
                  <Entypo name="trash" size={20} color="#4A148C" />
                </TouchableOpacity>

                <Text style={styles.dataHora}>{d.dataHora}</Text>
                <Text style={styles.prompt}>💡 {d.prompt}</Text>
                <Text style={styles.texto}>{d.texto}</Text>
              </View>
            ))
        ) : (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
            Selecione um personagem para visualizar os registros.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A148C',
    marginTop: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 10,
    backgroundColor: '#f5f3fa',
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
  diarioContainer: {
    backgroundColor: '#fdf6e3',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0d6b9',
  },
  dataHora: {
    fontWeight: '600',
    color: '#4A148C',
    marginBottom: 4,
  },
  texto: {
    color: '#4A3F35',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'serif',
  },
  prompt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6C5B7B',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A148C',
    marginBottom: 10,
    textAlign: 'center',
  },
  separador: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A148C',
    textAlign: 'center',
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#B39DDB',
    paddingBottom: 5,
  },
  botaoLixeira: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  diarioContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    position: 'relative',
  },
});
