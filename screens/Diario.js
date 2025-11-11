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
import { useRoute } from '@react-navigation/native';

const STORAGE_KEY = '@diariosPersonagem';

const temas = {
  Personalidade: [
    'Que língua(s) fala?',
    'Possui alguma frase de efeito?',
    'Repete palavras ou frases frequentemente?',
    'Otimista ou pessimistas',
    'Introvertido ou extrovertido?',
    'Quais são seus maus hábitos?',
    'Quais são seus bons hábitos?',
    'Como quer ser visto pelos outros?',
    'Como é visto pelos outros?',
    'Como vê a si?',
    'Como demonstra afeto?',
    'Quão competitivo é?',
    'Toma decisões rapidamente ou reflete antes?',
    'Como reage a elogios?',
    'Como reage a críticas?',
    'Qual é o seu maior medo?',
    'Quais são suas manias ou irritações?',
    'De qual sentido mais depende?',
    'Possui alguma deficiência mental?',
    'É matutino ou noturno?',
    'Qual o seu maior segredo?',
    'Qual a sua filosofia de vida?',
    'Quando foi a última vez que chorou?',
    'O que o assombra?',
    'Qual é a sua opinião política?',
    'Por qual causa se posicionaria?',
    'Quem é seu ídolo?',
    'Qual qualidade mais valoriza em um amigo?',
    'O que o faz rir alto?',
    'Se pudesse mudar algo em si mesmo, o que seria?',
    'Possui alguma obsessão?',
    'Qual é a lembrança mais marcante da infância dele?',
    'Se pudesse mudar algo em sua vida, o que seria?',
    'O que o faz sentir raiva ou frustração?',
    'Qual situação o deixa ansioso?',
    'Que lembrança desperta nostalgia nele?'
  ],
  Sonhos: [
    'Qual é o maior sonho do seu personagem?',
    'O que ele mais valoriza na vida?',
    'Que objetivo ele quer alcançar nos próximos 5 anos?',
    'Se pudesse viver em qualquer lugar, onde seria?',
    'Que habilidade gostaria de dominar?',
    'Como ele imagina seu futuro ideal?',
    'Qual é o desejo que nunca contou a ninguém?',
    'O que faria se pudesse realizar um sonho agora?',
    'Que mudança ele gostaria de ver no mundo?',
    'Como ele se inspira para perseguir seus sonhos?',
  ],
  Habilidades: [
    'Qual talento ele mais valoriza em si mesmo?',
    'Que habilidade gostaria de aprimorar?',
    'Como ele aprende melhor: sozinho ou com ajuda?',
    'Qual conquista o deixou mais orgulhoso?',
    'Que atividade o faz perder a noção do tempo?',
    'Como reage quando algo não sai como esperado?',
    'Qual habilidade o diferencia dos outros?',
    'O que ele faz quando precisa de criatividade?',
    'Que desafio gostaria de superar?',
    'Como ele ajuda outros com seus talentos?',
  ],
  Relacionamentos: [
    'Quem é a pessoa mais importante para ele e por quê?',
    'Qual sua percepção de família?',
    'Tem algum animal de estimação?',
    'Quem é seu melhor amigo?',
    'Como demonstra cuidado pelos outros?',
    'Qual conflito pessoal ele já enfrentou com alguém?',
    'Que segredo guarda de seus amigos?',
    'Como lida com conflitos familiares?',
    'Que atitude o faz se sentir conectado aos outros?',
  ],
  Aparência: [
    'Qual é sua altura',
    'Quanto ele pesa?',
    'Qual é sua forma/corpo?',
    'Qual é a cor de seu cabelo?',
    'Qual é o estilo de seu cabelo',
    'Qual é a cor de seus olhos?',
    'Usa óculos ou lentes de contato?',
    'Possui algum traço facial marcante?',
    'Costuma usar maquiagem?',
    'Usa alguma joia?',
    'Possui cicatrizes?',
    'Possui marcas de nascença?',
    'Possui tatuagens?',
    'Possui alguma deficiência física?',
    'Qual o tipo de roupa que costuma usar?',
    'Como estiliza suas roupas?',
    'Destro ou canhoto?',
  ],
  Conflito: [
    'Como responde a uma ameaça?',
    'Prefere lutar com os punhos ou com palavras?',
    'Qual é sua fraqueza?',
    'Como age com estranhos?',
    'Qual seria sua arma de escolha?',
    'Qual pessoa mais despreza?',
    'Já foi intimidado ou provocado?',
    'Para onde vai quando está com raiva?',
    'Quem são seus inimigos e por quê?',
  ],
  Hobbies: [
    'Qual é seu trabalho atual?',
    'Como se sente em relação ao trabalho atual?',
    'Quais trabalhos anteriores já teve?',
    'Quais são seus hobbies?',
    'Qual é sua formação educacional?',
    'Quão inteligente é?',
    'Possui algum treinamento especializado?',
    'Possui algum talento natural?',
    'Pratica algum esporte?',
    'Toca algum instrumento?',
    'Qual é seu status socioeconômico?',
  ],
  Preferências: [
    'Qual é seu animal favorito?',
    'Qual animal mais desgosta?',
    'Qual lugar mais gosta de estar?',
    'Qual a coisa mais bonita que já viu?',
    'Qual é sua música favorita?',
    'Prefere música, arte ou leitura?',
    'Qual é sua cor favorita?',
    'Qual é sua comida favorita?',
    'Qual é sua obra de arte favorita?',
    'Quem é seu artista favorito?',
    'Qual é seu dia da semana favorito?',
  ],
};

const temaKeys = Object.keys(temas);

export default function Diario() {
  const route = useRoute();

  const [diarios, setDiarios] = useState([]);
  const [novoDiario, setNovoDiario] = useState('');
  const [promptAtual, setPromptAtual] = useState('');
  const [personagemSelecionado, setPersonagemSelecionado] = useState('');
  const [temaSelecionado, setTemaSelecionado] = useState('Personalidade');

  const [modalVisivel, setModalVisivel] = useState(false);
  const [perguntaLivre, setPerguntaLivre] = useState('');

  const [personagens, setPersonagens] = useState([]);

  const [diarioParaExcluir, setDiarioParaExcluir] = useState(null);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);

  const [perguntasUsadas, setPerguntasUsadas] = useState({
    Personalidade: [],
    Sonhos: [],
    Habilidades: [],
    Relacionamentos: [],
    Conflito: [],
    Hobbies: [],
    Preferências: [],
  });

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
    if (route.params?.personagem) {
      setPersonagemSelecionado(route.params.personagem.nome);
    }
  }, [route.params]);

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

  const gerarPrompt = (tema = temaSelecionado) => {
    const perguntasTema = temas[tema] || temas['Geral'];
    const usadas = perguntasUsadas[tema] || [];

    // Filtra perguntas ainda não usadas
    const disponiveis = perguntasTema.filter((p) => !usadas.includes(p));

    let novaPergunta;
    if (disponiveis.length === 0) {
      // Se todas já foram usadas, reseta
      novaPergunta = perguntasTema[Math.floor(Math.random() * perguntasTema.length)];
      setPerguntasUsadas((prev) => ({ ...prev, [tema]: [] }));
    } else {
      // Escolhe aleatoriamente entre as disponíveis
      novaPergunta = disponiveis[Math.floor(Math.random() * disponiveis.length)];
      setPerguntasUsadas((prev) => ({
        ...prev,
        [tema]: [...usadas, novaPergunta],
      }));
    }

    setPromptAtual(novaPergunta);
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

        {personagemSelecionado ? (
          diarios.filter((d) => d.personagem === personagemSelecionado).length > 0 ? (
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
              Esse diário está vazio! Experimente escrever algo nele!
            </Text>
          )
        ) : (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
            Selecione um personagem para visualizar os registros.
          </Text>
        )}

        <Text style={styles.separador}>Registros Diários</Text>

        <Text style={styles.subtitulo}>
          Registre momentos, pensamentos ou anotações através de perguntas temáticas!      </Text>

        <Text style={styles.label}>Tema:</Text>

        <Picker
          selectedValue={temaSelecionado}
          onValueChange={(itemValue) => {
            setTemaSelecionado(itemValue);
            gerarPrompt(itemValue);
          }}
          style={styles.picker}>
          {temaKeys.map((tema, i) => (
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
            if (!personagemSelecionado) {
              Alert.alert('Atenção', 'Selecione um personagem antes de registrar!');
              return;
            }

            if (!novoDiario.trim()) {
              Alert.alert('Atenção', 'Escreva algo antes de registrar!');
              return;
            }

            adicionarDiario(); 
            tocarSom();
          }}
        />

          <BotaoCustomizado
            title="Gerar Outra Pergunta"
            onPress={() => gerarPrompt(temaSelecionado)}
          />
          <BotaoCustomizado
            title="Tema Livre"
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
                Qual será o tema?
              </Text>
              <TextInput
                style={[styles.input, styles.areaTexto]}
                value={perguntaLivre}
                onChangeText={setPerguntaLivre}
              />
              <View style={styles.centered}>
                <BotaoCustomizado
                  title="Gravar tema"
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
  centered: { 
    alignItems: 'center', 
    marginBottom: 15 
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
    marginTop: 30,
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
