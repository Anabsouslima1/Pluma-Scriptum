import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import CapituloItem from '../components/CapituloItem';
import BotaoCustomizado from '../components/BotaoCustomizado';

export default function CriarObra({ navigation }) {
  const route = useRoute();

  const [obras, setObras] = useState([]);
  const [obraSelecionada, setObraSelecionada] = useState(null);
  const [nomeObra, setNomeObra] = useState('');
  const [descricaoObra, setDescricaoObra] = useState('');
  const [tipoObraSelecionada, setTipoObraSelecionada] = useState('romance');
  const [novoTituloCap, setNovoTituloCap] = useState('');

  // Carrega obras
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

  // Salva obras
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('@obras', JSON.stringify(obras));
      } catch (e) {
        console.log('Erro ao salvar obras:', e);
      }
    })();
  }, [obras]);

  useEffect(() => {
    if (route.params?.nomeObra) {
      const encontrada = obras.find(o => o.nome === route.params.nomeObra);
      if (encontrada) setObraSelecionada(encontrada);
    }
  }, [route.params, obras]);

  const criarNovaObra = () => {
    const nomeLimpo = nomeObra.trim();
    if (!nomeLimpo) return Alert.alert('Atenção!', 'Digite o nome da obra antes de criar.');
    if (obras.some(o => o.nome.toLowerCase() === nomeLimpo.toLowerCase()))
      return Alert.alert('Atenção!', 'Já existe uma obra com esse nome!');

    const nova = {
      nome: nomeLimpo,
      descricao: descricaoObra.trim(),
      tipo: tipoObraSelecionada,
      capitulos: [],
      conteudo: '', // para poemas ou modo livre
    };

    setObras([...obras, nova]);
    setObraSelecionada(nova);
    setNomeObra('');
    setDescricaoObra('');
    setTipoObraSelecionada('romance');
  };

  const adicionarCapitulo = () => {
    if (!novoTituloCap.trim())
      return Alert.alert('Atenção!', 'Digite o nome do capítulo antes de adicionar.');
    const novoCapitulo = { titulo: novoTituloCap.trim(), conteudo: '' };
    atualizarObraSelecionada({
      ...obraSelecionada,
      capitulos: [...obraSelecionada.capitulos, novoCapitulo],
    });
    setNovoTituloCap('');
  };

  const atualizarObraSelecionada = (novaObra) => {
    setObraSelecionada(novaObra);
    setObras(prev => prev.map(o => (o.nome === novaObra.nome ? novaObra : o)));
  };

  const atualizarConteudo = (index, texto) => {
    const novosCap = [...obraSelecionada.capitulos];
    novosCap[index].conteudo = texto;
    atualizarObraSelecionada({ ...obraSelecionada, capitulos: novosCap });
  };

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

  const contagemTotalPalavras = () => {
    if (!obraSelecionada) return 0;
    if (obraSelecionada.tipo === 'poema' || obraSelecionada.tipo === 'livre') {
      return obraSelecionada.conteudo.trim().split(/\s+/).length;
    }
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

          <Text style={styles.nomeObra}>Selecione o tipo:</Text>
          <Picker
            selectedValue={tipoObraSelecionada}
            onValueChange={setTipoObraSelecionada}
            style={{ backgroundColor: '#e6def3ff', marginBottom: 15 }}
          >
            <Picker.Item label="Romance" value="romance" />
            <Picker.Item label="Conto" value="conto" />
            <Picker.Item label="Poema" value="poema" />
            <Picker.Item label="Modo Livre" value="livre" />
          </Picker>

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
          <Text style={styles.nomeObra}>{obraSelecionada.tipo.charAt(0).toUpperCase() + obraSelecionada.tipo.slice(1)}: {obraSelecionada.nome}</Text>

          {obraSelecionada.tipo !== 'poema' && obraSelecionada.tipo !== 'livre' ? (
            <>
              <TextInput
                style={styles.inputObra}
                value={obraSelecionada.descricao}
                onChangeText={texto =>
                  atualizarObraSelecionada({ ...obraSelecionada, descricao: texto })
                }
                placeholder="Digite a descrição da obra"
              />

              <Text style={styles.nomeObra}>Capítulos:</Text>
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
                    onChangeConteudo={text => atualizarConteudo(index, text)}
                    onExcluir={() => excluirCapitulo(index)}
                    onChangeTituloLocal={novoTitulo => {
                      const novosCap = [...obraSelecionada.capitulos];
                      novosCap[index].titulo = novoTitulo;
                      atualizarObraSelecionada({ ...obraSelecionada, capitulos: novosCap });
                    }}
                  />
                ))}
              </ScrollView>
            </>
          ) : (
            <TextInput
              style={styles.textoPoema}
              value={obraSelecionada.conteudo}
              onChangeText={texto =>
                atualizarObraSelecionada({ ...obraSelecionada, conteudo: texto })
              }
              placeholder="Escreva seu texto aqui..."
              multiline
            />
          )}

          <View style={styles.centeredContent}>
            <BotaoCustomizado
              title="Salvar Obra"
              onPress={() => Alert.alert('Sucesso', 'Obra salva!')}
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
                        setObras(obras.filter(o => o.nome !== obraSelecionada.nome));
                        setObraSelecionada(null);
                      },
                    },
                  ]
                );
              }}
            />
            <Text style={styles.estatisticas}>
              Total de palavras: {contagemTotalPalavras()}
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
  obrasContainer: {
    backgroundColor: '#ece9f0',
    borderColor: '#B39DDB',
    borderWidth: 7,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  centeredContent: { alignItems: 'center' },
  textoPoema: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    height: 300,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
});
