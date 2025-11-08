import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CapituloItem from '../components/CapituloItem';
import BotaoCustomizado from '../components/BotaoCustomizado';

export default function CriarObra({ navigation }) {
  const [obras, setObras] = useState([]);
  const [obraSelecionada, setObraSelecionada] = useState(null);
  const [nomeObra, setNomeObra] = useState('');
  const [novoTituloCap, setNovoTituloCap] = useState('');

  // Carrega obras do AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const dados = await AsyncStorage.getItem('@obras');
        if (dados) setObras(JSON.parse(dados));
      } catch (e) {
        console.log('Erro ao carregar obras:', e);
      }
    })();
  }, []);

  // Salva obras no AsyncStorage sempre que mudam
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('@obras', JSON.stringify(obras));
      } catch (e) {
        console.log('Erro ao salvar obras:', e);
      }
    })();
  }, [obras]);

  // Criar nova obra
  const criarNovaObra = () => {
    const nomeLimpo = nomeObra.trim();
    if (!nomeLimpo) return Alert.alert('Atenção!', 'Digite o nome da obra antes de criar.');

    if (obras.some((o) => o.nome.toLowerCase() === nomeLimpo.toLowerCase()))
      return Alert.alert('Atenção!', 'Já existe uma obra com esse nome!');

    const nova = { nome: nomeLimpo, capitulos: [] };
    setObras([...obras, nova]);
    setObraSelecionada(nova);
    setNomeObra('');
  };

  // Adicionar capítulo
  const adicionarCapitulo = () => {
    if (!novoTituloCap.trim()) return Alert.alert('Atenção!', 'Digite o nome do capítulo antes de adicionar.');
    const novoCapitulo = { titulo: novoTituloCap.trim(), conteudo: '' };
    atualizarObraSelecionada({ ...obraSelecionada, capitulos: [...obraSelecionada.capitulos, novoCapitulo] });
    setNovoTituloCap('');
  };

  // Atualiza obra selecionada
  const atualizarObraSelecionada = (novaObra) => {
    setObraSelecionada(novaObra);
    setObras((prev) => prev.map((o) => (o.nome === novaObra.nome ? novaObra : o)));
  };

  // Atualiza conteúdo do capítulo
  const atualizarConteudo = (index, texto) => {
    const novosCap = [...obraSelecionada.capitulos];
    novosCap[index].conteudo = texto;
    atualizarObraSelecionada({ ...obraSelecionada, capitulos: novosCap });
  };

  // Excluir capítulo
  const excluirCapitulo = (index) => {
    Alert.alert(
      'Excluir Capítulo',
      `Tem certeza que deseja excluir o capítulo "${obraSelecionada.capitulos[index].titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novosCap = obraSelecionada.capitulos.filter((_, i) => i !== index);
            atualizarObraSelecionada({ ...obraSelecionada, capitulos: novosCap });
          },
        },
      ]
    );
  };

  // Contagem de palavras
  const contagemTotalPalavras = () => {
    if (!obraSelecionada) return 0;
    return obraSelecionada.capitulos.reduce((total, cap) => {
      if (!cap.conteudo?.trim()) return total;
      return total + cap.conteudo.trim().split(/\s+/).length;
    }, 0);
  };

  return (
    <View style={styles.container}>
      {!obraSelecionada ? (
        <>
          <Text style={styles.nomeObra}>Criar ou selecionar obra:</Text>
          <TextInput
            style={styles.inputObra}
            value={nomeObra}
            onChangeText={setNomeObra}
            placeholder="Digite o nome da obra"
          />
          <View style={styles.centeredContent}>
            <BotaoCustomizado title="Criar Obra" onPress={criarNovaObra} />
          </View>

          {obras.length > 0 && (
            <View style={styles.obrasContainer}>
              {obras.map((obra, index) => (
                <BotaoCustomizado
                  key={index}
                  title={obra.nome}
                  onPress={() => setObraSelecionada(obra)}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={styles.nomeObra}>Obra: {obraSelecionada.nome}</Text>
          <TextInput
            style={styles.inputObra}
            value={novoTituloCap}
            onChangeText={setNovoTituloCap}
            placeholder="Nome do capítulo"
          />
          <View style={styles.centeredContent}>
            <BotaoCustomizado title="Adicionar Capítulo" onPress={adicionarCapitulo} />
          </View>

          <ScrollView style={styles.listaCapitulos}>
            {obraSelecionada.capitulos.map((cap, index) => (
              <CapituloItem
                key={index}
                numero={index + 1}
                titulo={cap.titulo}
                conteudo={cap.conteudo}
                onChangeConteudo={(text) => atualizarConteudo(index, text)}
                onExcluir={() => excluirCapitulo(index)}
                // ✅ Passa função para editar título inline com ícone de lápis
                onChangeTituloLocal={(novoTitulo) => {
                  const novosCap = [...obraSelecionada.capitulos];
                  novosCap[index].titulo = novoTitulo;
                  atualizarObraSelecionada({ ...obraSelecionada, capitulos: novosCap });
                }}
              />
            ))}
          </ScrollView>

          <View style={styles.centeredContent}>
            <BotaoCustomizado
              title="Salvar Capítulos"
              onPress={() => Alert.alert('Sucesso', 'Capítulos salvos!')}
              style={{ marginTop: 10 }}
            />
            <BotaoCustomizado
              title="Excluir Obra"
              style={{ marginTop: 10, backgroundColor: '#e53935' }}
              onPress={() => {
                Alert.alert(
                  'Excluir Obra',
                  `Tem certeza que deseja excluir a obra "${obraSelecionada.nome}"?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Excluir',
                      style: 'destructive',
                      onPress: () => {
                        setObras(obras.filter((o) => o.nome !== obraSelecionada.nome));
                        setObraSelecionada(null);
                      },
                    },
                  ]
                );
              }}
            />
            <Text style={styles.estatisticas}>
              Total de capítulos: {obraSelecionada.capitulos.length} | Total de
              palavras: {contagemTotalPalavras()}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  nomeObra: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  inputObra: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15 },
  listaCapitulos: { marginTop: 10, marginBottom: 15 },
  estatisticas: { fontSize: 14, fontWeight: '600', marginTop: 10 },
  obrasContainer: { backgroundColor: '#ece9f0', borderColor: '#B39DDB', borderWidth: 7, borderRadius: 16, padding: 16, marginTop: 10, width: '100%', alignItems: 'center' },
  centeredContent: { alignItems: 'center' },
});
