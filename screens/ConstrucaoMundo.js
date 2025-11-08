import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoCustomizado from '../components/BotaoCustomizado';

const STORAGE_KEY = '@mundos';

export default function ConstrucaoMundo() {
  const [mundos, setMundos] = useState([]);
  const [mundoSelecionado, setMundoSelecionado] = useState(null);
  const [nomeMundo, setNomeMundo] = useState('');
  const [novoTopico, setNovoTopico] = useState('');
  const [temas, setTemas] = useState([
    'Sociedade',
    'Religião',
    'Geografia',
    'Cultura',
    'Política',
  ]);

  const normalize = (s = '') => s.trim().toLowerCase();

  // Carregar mundos
  useEffect(() => {
    (async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) setMundos(JSON.parse(dados));
      } catch (e) {
        console.log('Erro ao carregar mundos:', e);
      }
    })();
  }, []);

  // Salvar mundos automaticamente
  useEffect(() => {
    if (!mundos) return;
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mundos));
      } catch (e) {
        console.log('Erro ao salvar mundos:', e);
      }
    })();
  }, [mundos]);

  const criarNovoMundo = () => {
    const nome = nomeMundo.trim();
    if (!nome) {
      Alert.alert('Atenção', 'Por favor, nomeie o mundo antes de criar.');
      return;
    }

    const jaExiste = mundos.some((m) => normalize(m.nome) === normalize(nome));
    if (jaExiste) {
      Alert.alert('Atenção', 'Já existe um mundo com esse nome!');
      return;
    }

    const novo = { nome, topicos: [] };
    setMundos([...mundos, novo]);
    setMundoSelecionado(novo);
    setNomeMundo('');
  };

  const selecionarMundo = (nome) => {
    const encontrado = mundos.find((m) => normalize(m.nome) === normalize(nome));
    if (encontrado) {
      setMundoSelecionado(encontrado);

      const temasDoMundo = encontrado.topicos?.map((t) => t.tema) || [];
      const temasPadrao = ['Sociedade', 'Religião', 'Geografia', 'Cultura', 'Política'];
      const todosTemas = Array.from(new Set([...temasPadrao, ...temasDoMundo]));
      setTemas(todosTemas);
    }
  };

  const adicionarTopico = () => {
    if (!mundoSelecionado) {
      Alert.alert('Atenção', 'Selecione ou crie um mundo antes de adicionar um tema.');
      return;
    }

    if (!novoTopico.trim()) {
      Alert.alert('Atenção', 'Digite o nome do tema antes de adicionar.');
      return;
    }

    const temaNovo = novoTopico.trim();

    if (!temas.some((t) => normalize(t) === normalize(temaNovo))) {
      setTemas((prev) => [...prev, temaNovo]);
    }

    const already = (mundoSelecionado.topicos || []).some(
      (t) => normalize(t.tema) === normalize(temaNovo)
    );
    if (already) {
      Alert.alert('Atenção', 'Tema já existe neste mundo.');
      setNovoTopico('');
      return;
  }

    const novo = { tema: temaNovo, conteudo: '' };
    setMundos((prev) => {
      return prev.map((m) => {
        if (normalize(m.nome) === normalize(mundoSelecionado.nome)) {
          const mundoAtualizado = {
            ...m,
            topicos: [...(m.topicos || []), novo],
          };
          setMundoSelecionado(mundoAtualizado);
          return mundoAtualizado;
        }
        return m;
      });
    });

    setNovoTopico('');
  };

  const atualizarOuCriarConteudo = (tema, texto) => {
    if (!mundoSelecionado) return;

    const existenteIndex = (mundoSelecionado.topicos || []).findIndex(
      (t) => normalize(t.tema) === normalize(tema)
    );

    if (existenteIndex >= 0) {
      const novosTopicos = [...mundoSelecionado.topicos];
      novosTopicos[existenteIndex] = { ...novosTopicos[existenteIndex], conteudo: texto };

      setMundos((prev) =>
        prev.map((m) =>
          normalize(m.nome) === normalize(mundoSelecionado.nome)
            ? { ...m, topicos: novosTopicos }
            : m
        )
      );
      setMundoSelecionado({ ...mundoSelecionado, topicos: novosTopicos });
    } else {
      const novo = { tema, conteudo: texto };
      setMundos((prev) =>
        prev.map((m) =>
          normalize(m.nome) === normalize(mundoSelecionado.nome)
            ? { ...m, topicos: [...(m.topicos || []), novo] }
            : m
        )
      );
      setMundoSelecionado({
        ...mundoSelecionado,
        topicos: [...(mundoSelecionado.topicos || []), novo],
      });

      if (!temas.some((t) => normalize(t) === normalize(tema))) {
        setTemas((prev) => [...prev, tema]);
      }
    }
  };

  const salvarMundo = async () => {
    if (!mundoSelecionado) return;
    try {
      const novosMundos = mundos.map((m) =>
        normalize(m.nome) === normalize(mundoSelecionado.nome)
          ? mundoSelecionado
          : m
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosMundos));
      Alert.alert('Sucesso', 'Mundo salvo com sucesso!');
    } catch (e) {
      console.log('Erro ao salvar mundo:', e);
      Alert.alert('Erro', 'Erro ao salvar o mundo.');
    }
  };

  const excluirMundo = () => {
    if (!mundoSelecionado) return;

    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o mundo "${mundoSelecionado.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const restantes = mundos.filter(
              (m) => normalize(m.nome) !== normalize(mundoSelecionado.nome)
            );
            setMundos(restantes);
            setMundoSelecionado(null);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(restantes));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {!mundoSelecionado ? (
        <>
          <Text style={styles.titulo}>Construção de Mundo</Text>
          <Text style={styles.subtitulo}>
            Crie um novo mundo e explore suas camadas criativas.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do mundo"
            value={nomeMundo}
            onChangeText={setNomeMundo}
          />

          <View style={styles.centered}>
            <BotaoCustomizado title="Criar Mundo" onPress={criarNovoMundo} />
          </View>

          {mundos.length > 0 ? (
            <View style={styles.mundosContainer}>
              {mundos.map((m, i) => (
                <BotaoCustomizado
                  key={i}
                  title={m.nome}
                  onPress={() => selecionarMundo(m.nome)}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.semMundos}>
              Nenhum mundo criado ainda. Crie um novo mundo para começar!
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={styles.titulo}>🌍 {mundoSelecionado.nome}</Text>
          <Text style={styles.subtitulo}>
            Explore temas como sociedade, religião, cultura e muito mais.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Adicionar novo tema (opcional)"
            value={novoTopico}
            onChangeText={setNovoTopico}
          />

          <View style={styles.centered}>
            <BotaoCustomizado title="Adicionar Tema" onPress={adicionarTopico} />
          </View>

          <ScrollView style={styles.lista}>
            {temas.map((tema, i) => {
              const existenteIndex = (mundoSelecionado.topicos || []).findIndex(
                (t) => normalize(t.tema) === normalize(tema)
              );
              const conteudo =
                existenteIndex >= 0
                  ? mundoSelecionado.topicos[existenteIndex].conteudo
                  : '';
              return (
                <View key={i} style={styles.topicoContainer}>
                  <Text style={styles.temaTitulo}>{tema}</Text>
                  <TextInput
                    style={styles.areaTexto}
                    multiline
                    placeholder={`Descreva o aspecto de ${tema.toLowerCase()} do seu mundo...`}
                    value={conteudo}
                    onChangeText={(texto) => atualizarOuCriarConteudo(tema, texto)}
                  />
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.centered}>
            <BotaoCustomizado title="Salvar Mundo" onPress={salvarMundo} />
            <BotaoCustomizado
              title="Excluir Mundo"
              onPress={excluirMundo}
              style={{ marginTop: 10, backgroundColor: '#e53935' }}
            />
          </View>
        </>
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
  input: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  centered: { alignItems: 'center' },
  mundosContainer: {
    backgroundColor: '#ece9f0',
    borderColor: '#B39DDB',
    borderWidth: 7,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  semMundos: {
    textAlign: 'center',
    color: '#6C5B7B',
    marginTop: 10,
    fontStyle: 'italic',
  },
  lista: { marginTop: 15 },
  topicoContainer: {
    backgroundColor: '#f5f3fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  temaTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A148C',
    marginBottom: 8,
  },
  areaTexto: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    minHeight: 80,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});
