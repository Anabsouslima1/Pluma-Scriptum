import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoCustomizado from '../components/BotaoCustomizado';

const STORAGE_KEY = '@personagens';

export default function CriarPersonagem({ navigation }) {
  const [personagens, setPersonagens] = useState([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('');
  const [habilidades, setHabilidades] = useState('');
  const [aparencia, setAparencia] = useState('');
  const [historia, setHistoria] = useState('');

  const [papel, setPapel] = useState('');
  const [personalidade, setPersonalidade] = useState('');

  const [modalVisivel, setModalVisivel] = useState(false);
  const [personagemEditando, setPersonagemEditando] = useState(null);
  const [inputFocado, setInputFocado] = useState('');

  const [obras, setObras] = useState([]); 
  const [obraSelecionada, setObraSelecionada] = useState('');
  const [filtroObra, setFiltroObra] = useState(''); 


  useEffect(() => {
    (async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) setPersonagens(JSON.parse(dados));

        const obrasDados = await AsyncStorage.getItem('@obras');
        if (obrasDados) setObras(JSON.parse(obrasDados));
      } catch (e) {
        console.log('Erro ao carregar personagens ou obras:', e);
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
      genero: genero.trim(),
      habilidades: habilidades.trim(),
      aparencia: aparencia.trim(),
      historia: historia.trim(),
      obraId: obraSelecionada,
      criadoEm: new Date().toISOString(),
    };

    const atualizados = [...personagens, novo];
    await salvarPersonagens(atualizados);

    setNome('');
    setIdade('');
    setGenero('');
    setHabilidades('');
    setAparencia('');
    setHistoria('');
    setPapel('');
    setPersonalidade('');
  };

  const excluirPersonagem = async () => {
    if (!personagemEditando) return;

    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir ${personagemEditando.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            const filtrados = personagens.filter(
              p => p.criadoEm !== personagemEditando.criadoEm
            );
            await salvarPersonagens(filtrados);
            cancelarEdicao();
          } 
        },
      ]
    );
  };

  const abrirEdicao = (p) => {
    setPersonagemEditando(p);
    setNome(p.nome);
    setIdade(p.idade);
    setGenero(p.genero || '');
    setHabilidades(p.habilidades || '');
    setAparencia(p.aparencia || '');
    setHistoria(p.historia || '');
    setPapel(p.papel);
    setPersonalidade(p.personalidade);
    setObraSelecionada(p.obraId || '');
    setModalVisivel(true);
  };

  const cancelarEdicao = () => {
    setModalVisivel(false);
    setPersonagemEditando(null);
    setNome('');
    setIdade('');
    setGenero('');
    setHabilidades('');
    setAparencia('');
    setHistoria('');
    setPapel('');
    setPersonalidade('');
  };

  const salvarEdicao = async () => {
    if (!personagemEditando) return;

    const atualizado = {
      ...personagemEditando,
      nome: nome.trim(),
      idade: idade.trim(),
      papel: papel.trim(),
      personalidade: personalidade.trim(),
      genero: genero.trim(),
      habilidades: habilidades.trim(),
      aparencia: aparencia.trim(),
      historia: historia.trim(),
      obraId: obraSelecionada,
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

  const renderTags = (p) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
      {p.papel ? (
        <Text
          style={[
            styles.tag,
            (() => {
              const papelLower = p.papel.toLowerCase();
              if (papelLower.includes('antagonista') || papelLower.includes('vilão')) {
                return { backgroundColor: '#201e1e', color: '#e53935' };
              } else if (papelLower.includes('secundário') || papelLower.includes('apoio')) {
                return { backgroundColor: '#90caf9', color: '#fff' };
              } else if (papelLower.includes('protagonista') || papelLower.includes('herói')) {
                return { backgroundColor: '#a5d6a7', color: '#2e7d32' };
              } else if (papelLower.includes('mentor') || papelLower.includes('guia')) {
                return { backgroundColor: '#ffcc80', color: '#bf360c' };
              } else if (papelLower.includes('cômico') || papelLower.includes('alívio')) {
                return { backgroundColor: '#fff59d', color: '#000' };
              } else if (papelLower.includes('anti-herói') || papelLower.includes('anti-heroi')) {
                return { backgroundColor: '#ba68c8', color: '#4a148c' };
              } else {
                return { backgroundColor: '#b0bec5', color: '#000' };
              }
            })(),
          ]}
        >
          Papel: {p.papel}
        </Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40}}>
      <Text style={styles.titulo}>Criar Personagem</Text>
      <Text style={styles.subtitulo}>Explore e dê vida aos seus personagens!</Text>

      <Picker
        selectedValue={obraSelecionada}
        onValueChange={(itemValue) => setObraSelecionada(itemValue)}
        style={styles.pickerContainer}
      >
        <Picker.Item label="Selecione a obra" value="" />
        {obras.map((obra) => (
          <Picker.Item key={obra.id} label={obra.nome} value={obra.id} />
        ))}
      </Picker>

      <TextInput
        style={[styles.input, inputFocado === 'nome' && styles.inputFocused]}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        onFocus={() => setInputFocado('nome')}
        onBlur={() => setInputFocado('')}
      />
      <TextInput
        style={[styles.input, inputFocado === 'idade' && styles.inputFocused]}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        onFocus={() => setInputFocado('idade')}
        onBlur={() => setInputFocado('')}
      />
      <TextInput
        style={[styles.input, inputFocado === 'genero' && styles.inputFocused]}
        placeholder="Gênero"
        value={genero}
        onChangeText={setGenero}
        onFocus={() => setInputFocado('genero')}
        onBlur={() => setInputFocado('')}
      />
        <View style={[styles.input, styles.pickerContainer]}>
        <Picker
          selectedValue={papel}
          onValueChange={(itemValue) => setPapel(itemValue)}
          style={{ color: '#4A148C' }}
        >
          <Picker.Item label="Selecione o papel" value="" />
          <Picker.Item label="Protagonista" value="Protagonista" />
          <Picker.Item label="Anti-Herói" value="Anti-Herói" />
          <Picker.Item label="Secundário" value="Secundário" />
          <Picker.Item label="Antagonista" value="Antagonista" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>
      <TextInput
        style={[styles.input, inputFocado === 'habilidades' && styles.inputFocused, styles.areaTexto]}
        placeholder="Habilidades / poderes"
        value={habilidades}
        onChangeText={setHabilidades}
        multiline
        onFocus={() => setInputFocado('habilidades')}
        onBlur={() => setInputFocado('')}
      />
      <TextInput
        style={[styles.input, inputFocado === 'aparencia' && styles.inputFocused, styles.areaTexto]}
        placeholder="Aparência física"
        value={aparencia}
        onChangeText={setAparencia}
        multiline
        onFocus={() => setInputFocado('aparencia')}
        onBlur={() => setInputFocado('')}
      />
      <TextInput
        style={[styles.input, inputFocado === 'historia' && styles.inputFocused, styles.areaTexto]}
        placeholder="História curta / background"
        value={historia}
        onChangeText={setHistoria}
        multiline
        onFocus={() => setInputFocado('historia')}
        onBlur={() => setInputFocado('')}
      />
      <TextInput
        style={[styles.input, styles.areaTexto, inputFocado === 'personalidade' && styles.inputFocused]}
        placeholder="Personalidade / características"
        value={personalidade}
        onChangeText={setPersonalidade}
        multiline
        onFocus={() => setInputFocado('personalidade')}
        onBlur={() => setInputFocado('')}
      />

      <View style={styles.centered}>
        <BotaoCustomizado
          title={personagemEditando ? "Salvar Edição" : "Criar Personagem"}
          onPress={personagemEditando ? salvarEdicao : criarPersonagem}
          style={{ backgroundColor: personagemEditando ? '#7B1FA2' : '#4A148C' }}
        />
      </View>

      {personagens.length > 0 && (
        <View>
         <Picker
          selectedValue={filtroObra}
          onValueChange={setFiltroObra}
          style={styles.pickerContainer}
        >
          <Picker.Item label="Todos" value="" />
          {obras.map((obra) => (
            <Picker.Item key={obra.id} label={obra.nome} value={obra.id} />
          ))}
        </Picker>
      
        <Text style={[styles.subtitulo, { marginTop: 20 }]}>
          Personagens Criados:
        </Text>
        </View>
      )}

      <View style={{ marginBottom: 20 }}>
        {personagens
          .filter(p => !filtroObra || p.obraId === filtroObra)
          .map((p, i) => (
            <TouchableOpacity key={i} onPress={() => abrirEdicao(p)}>
              <View style={styles.personagemContainer}>
                <Text style={styles.nome}>{p.nome}</Text>
                {p.papel && renderTags(p)}
                {p.obraId && (
                  <Text style={styles.tagObra}>
                    {obras.find(o => o.id === p.obraId)?.nome || ''}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
        ))}

      </View>

      {/* Modal de edição */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.titulo}>Editar Personagem</Text>

            <TextInput
              style={[styles.input, inputFocado === 'nome' && styles.inputFocused]}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              onFocus={() => setInputFocado('nome')}
              onBlur={() => setInputFocado('')}
            />
            <TextInput
              style={[styles.input, inputFocado === 'idade' && styles.inputFocused]}
              placeholder="Idade"
              value={idade}
              onChangeText={setIdade}
              keyboardType="numeric"
              onFocus={() => setInputFocado('idade')}
              onBlur={() => setInputFocado('')}
            />
            <TextInput
              style={[styles.input, inputFocado === 'genero' && styles.inputFocused]}
              placeholder="Gênero"
              value={genero}
              onChangeText={setGenero}
              onFocus={() => setInputFocado('genero')}
              onBlur={() => setInputFocado('')}
            />
            <View style={[styles.input, styles.pickerContainer]}>
              <Picker
                selectedValue={papel}
                onValueChange={(itemValue) => setPapel(itemValue)}
                style={{ color: '#4A148C' }}
              >
                <Picker.Item label="Selecione o papel" value="" />
                <Picker.Item label="Protagonista" value="Protagonista" />
                <Picker.Item label="Secundário" value="Secundário" />
                <Picker.Item label="Antagonista" value="Antagonista" />
                <Picker.Item label="Anti-Herói" value="Anti-Herói" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </View>
            <TextInput
              style={[styles.input, inputFocado === 'habilidades' && styles.inputFocused, styles.areaTexto]}
              placeholder="Habilidades / poderes"
              value={habilidades}
              onChangeText={setHabilidades}
              multiline
              onFocus={() => setInputFocado('habilidades')}
              onBlur={() => setInputFocado('')}
            />
            <TextInput
              style={[styles.input, inputFocado === 'aparencia' && styles.inputFocused, styles.areaTexto]}
              placeholder="Aparência física"
              value={aparencia}
              onChangeText={setAparencia}
              multiline
              onFocus={() => setInputFocado('aparencia')}
              onBlur={() => setInputFocado('')}
            />
            <TextInput
              style={[styles.input, inputFocado === 'historia' && styles.inputFocused, styles.areaTexto]}
              placeholder="História curta / background"
              value={historia}
              onChangeText={setHistoria}
              multiline
              onFocus={() => setInputFocado('historia')}
              onBlur={() => setInputFocado('')}
            />

            <TextInput
              style={[styles.input, styles.areaTexto, inputFocado === 'personalidade' && styles.inputFocused]}
              placeholder="Personalidade / características"
              value={personalidade}
              onChangeText={setPersonalidade}
              multiline
              onFocus={() => setInputFocado('personalidade')}
              onBlur={() => setInputFocado('')}
            />

            {/* Botões */}
            <View style={styles.botaoColuna}>
              <BotaoCustomizado
                title="Salvar"
                onPress={salvarEdicao}
                style={{ width: '80%', marginBottom: 10 }}
              />
              <BotaoCustomizado
                title="Cancelar"
                onPress={cancelarEdicao}
                style={{ width: '80%', marginBottom: 10, backgroundColor: '#9e9e9e' }}
              />
              <BotaoCustomizado
                title="Excluir Personagem"
                onPress={excluirPersonagem}
                style={{ width: '80%', marginBottom: 10, backgroundColor: '#e53935' }}
              />
              <BotaoCustomizado
                title="📖 Explorar Diário"
                onPress={() => {
                  navigation.navigate('DiarioPersonagem', { personagem: personagemEditando });
                  setModalVisivel(false);
                }}
                style={{ width: '80%', backgroundColor: '#6C5B7B' }}
              />
            </View>
          </ScrollView>
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
    fontSize: 14,
  },
  inputFocused: {
    borderColor: '#7B1FA2',
    shadowColor: '#7B1FA2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  areaTexto: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  centered: { alignItems: 'center', alignContent: 'center', marginBottom: 15 },
  personagemContainer: {
    backgroundColor: '#f5f3fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  nome: {
    fontWeight: '600',
    fontSize: 16,
    color: '#4A148C',
  },
  tag: {
    backgroundColor: '#E1BEE7',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    fontSize: 12,
    color: '#4A148C',
    fontWeight: '500',
    alignSelf: 'flex-start'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  botaoColuna: {
    alignItems: 'center',
    marginTop: 15,
  },
  pickerContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tagObra: {
    backgroundColor: '#e0e0e0',
    color: '#424242',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginTop: 3,
  },
});
