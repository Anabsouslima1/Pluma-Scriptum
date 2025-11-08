// screens/CriarPersonagem.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoCustomizado from '../components/BotaoCustomizado';

const STORAGE_KEY = '@personagens';

export default function CriarPersonagem({ navigation }) {
  const [personagens, setPersonagens] = useState([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [papel, setPapel] = useState('');
  const [personalidade, setPersonalidade] = useState('');

  const [modalVisivel, setModalVisivel] = useState(false);
  const [personagemEditando, setPersonagemEditando] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) setPersonagens(JSON.parse(dados));
      } catch (e) {
        console.log('Erro ao carregar personagens:', e);
      }
    })();
  }, []);

  const salvarPersonagens = async (lista) => {
    setPersonagens(lista);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const criarPersonagem = async () => {
    const nomeTrim = nome.trim();
    if (!nomeTrim) {
      Alert.alert('Atenção', 'Informe o nome do personagem!');
      return;
    }

    const jaExiste = personagens.some(p => p.nome.toLowerCase() === nomeTrim.toLowerCase());
    if (jaExiste) {
      Alert.alert('Atenção', 'Já existe um personagem com este nome!');
      return;
    }

    const novo = {
      nome: nomeTrim,
      idade: idade.trim(),
      papel: papel.trim(),
      personalidade: personalidade.trim(),
      criadoEm: new Date().toISOString(),
    };

    const atualizados = [...personagens, novo];
    await salvarPersonagens(atualizados);

    // Limpa campos
    setNome('');
    setIdade('');
    setPapel('');
    setPersonalidade('');

    navigation.navigate('DiarioPersonagem', { personagem: novo });
  };

  const abrirEdicao = (p) => {
    setPersonagemEditando(p);
    setNome(p.nome);
    setIdade(p.idade);
    setPapel(p.papel);
    setPersonalidade(p.personalidade);
    setModalVisivel(true);
  };

  const salvarEdicao = async () => {
    if (!personagemEditando) return;

    const atualizado = {
      ...personagemEditando,
      nome: nome.trim(),
      idade: idade.trim(),
      papel: papel.trim(),
      personalidade: personalidade.trim(),
    };

    const atualizados = personagens.map(p =>
      p.criadoEm === personagemEditando.criadoEm ? atualizado : p
    );

    await salvarPersonagens(atualizados);

    setModalVisivel(false);
    setPersonagemEditando(null);
    setNome('');
    setIdade('');
    setPapel('');
    setPersonalidade('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Criar Personagem</Text>
      <Text style={styles.subtitulo}>
        Defina os detalhes básicos do seu personagem antes de começar o diário.
      </Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput style={styles.input} placeholder="Papel" value={papel} onChangeText={setPapel} />
      <TextInput
        style={[styles.input, styles.areaTexto]}
        placeholder="Personalidade / características"
        value={personalidade}
        onChangeText={setPersonalidade}
        multiline
      />

      <View style={styles.centered}>
        <BotaoCustomizado title={personagemEditando ? "Salvar Edição" : "Criar Personagem"} onPress={personagemEditando ? salvarEdicao : criarPersonagem} />
      </View>

      <Text style={[styles.subtitulo, { marginTop: 20 }]}>Personagens Criados:</Text>
      {personagens.map((p, i) => (
        <TouchableOpacity key={i} onPress={() => abrirEdicao(p)}>
          <View style={styles.personagemContainer}>
            <Text style={styles.nome}>{p.nome}</Text>
            <Text>Idade: {p.idade || '-'}</Text>
            <Text>Papel: {p.papel || '-'}</Text>
            <Text>Personalidade: {p.personalidade || '-'}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Modal de edição */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titulo}>Editar Personagem</Text>
            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={idade}
              onChangeText={setIdade}
              keyboardType="numeric"
            />
            <TextInput style={styles.input} placeholder="Papel" value={papel} onChangeText={setPapel} />
            <TextInput
              style={[styles.input, styles.areaTexto]}
              placeholder="Personalidade / características"
              value={personalidade}
              onChangeText={setPersonalidade}
              multiline
            />
            <View style={styles.centered}>
              <BotaoCustomizado title="Salvar" onPress={salvarEdicao} />
              <BotaoCustomizado title="Cancelar" onPress={() => setModalVisivel(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  areaTexto: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  centered: { alignItems: 'center', marginBottom: 15 },
  personagemContainer: {
    backgroundColor: '#f5f3fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  nome: {
    fontWeight: '600',
    fontSize: 16,
    color: '#4A148C',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
});
