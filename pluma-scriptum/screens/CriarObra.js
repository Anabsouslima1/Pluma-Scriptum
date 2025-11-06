import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CapituloItem from '../components/CapituloItem';
import BotaoCustomizado from '../components/BotaoCustomizado';

export default function CriarObra() {
  // Estados
  const [obras, setObras] = useState([]);
  const [obraSelecionada, setObraSelecionada] = useState(null);
  const [nomeObra, setNomeObra] = useState('');
  const [novoTituloCap, setNovoTituloCap] = useState('');

  // Carregar obras do AsyncStorage
  useEffect(() => {
    const carregarObras = async () => {
      try {
        const dados = await AsyncStorage.getItem('@obras');
        if (dados) setObras(JSON.parse(dados));
      } catch (e) {
        console.log('Erro ao carregar obras:', e);
      }
    };
    carregarObras();
  }, []);

  // Salvar obras sempre que mudarem
  useEffect(() => {
    const salvarObras = async () => {
      try {
        await AsyncStorage.setItem('@obras', JSON.stringify(obras));
      } catch (e) {
        console.log('Erro ao salvar obras:', e);
      }
    };
    salvarObras();
  }, [obras]);

  // Criar nova obra
  const criarNovaObra = () => {
    const nomeLimpo = nomeObra.trim();
    if (!nomeLimpo) return;

    // Verifica se já existe uma obra com o mesmo nome (case-insensitive)
    const jaExiste = obras.some(
      (obra) => obra.nome.toLowerCase() === nomeLimpo.toLowerCase()
    );

    if (jaExiste) {
      alert('Já existe uma obra com esse nome!');
      return;
    }

    const nova = { nome: nomeLimpo, capitulos: [] };
    setObras([...obras, nova]);
    setObraSelecionada(nova);
    setNomeObra('');
  };

  const salvarCapitulos = () => {
    if (!obraSelecionada) return;

    // Busca a obra atualizada pelo nome
    const obraAtualizada = obras.find(
      (obra) => obra.nome === obraSelecionada.nome
    );

    if (!obraAtualizada) return;

    // Atualiza a obra no array de obras
    const obrasAtualizadas = obras.map((obra) =>
      obra.nome === obraAtualizada.nome ? obraAtualizada : obra
    );

    setObras(obrasAtualizadas);
    setObraSelecionada(obraAtualizada); // garante que obraSelecionada esteja sincronizada
    alert('Capítulos salvos com sucesso!');
  };

  // Adicionar capítulo à obra selecionada
  const adicionarCapitulo = () => {
    if (!novoTituloCap.trim()) return;

    // Cria novo capítulo
    const novoCapitulo = { titulo: novoTituloCap.trim(), conteudo: '' };

    // Atualiza obra selecionada com novo capítulo
    const obraAtualizada = {
      ...obraSelecionada,
      capitulos: [...obraSelecionada.capitulos, novoCapitulo],
    };

    // Atualiza lista de obras
    const obrasAtualizadas = obras.map((obra) =>
      obra.nome === obraSelecionada.nome ? obraAtualizada : obra
    );

    setObras(obrasAtualizadas);
    setObraSelecionada(obraAtualizada); // garante que obraSelecionada esteja sincronizada
    setNovoTituloCap('');
  };

  // Atualizar conteúdo do capítulo
  const atualizarConteudo = (index, texto) => {
    const novosCap = [...obraSelecionada.capitulos];
    novosCap[index].conteudo = texto;

    const obrasAtualizadas = obras.map((o) =>
      o === obraSelecionada ? { ...o, capitulos: novosCap } : o
    );

    setObras(obrasAtualizadas);
    setObraSelecionada({ ...obraSelecionada, capitulos: novosCap });
  };

  // Contagem total de palavras
  const contagemTotalPalavras = () => {
    if (!obraSelecionada) return 0;

    return obraSelecionada.capitulos.reduce((total, cap) => {
      if (!cap.conteudo || !cap.conteudo.trim()) return total;

      const palavras = cap.conteudo
        .replace(/\n/g, ' ') // substitui quebras de linha por espaço
        .trim()
        .split(/\s+/)
        .filter((p) => p.length > 0); // remove strings vazias

      return total + palavras.length;
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

          <View style={styles.obrasContainer}>
            {obras.map((obra, index) => (
              <BotaoCustomizado
                key={index}
                title={obra.nome}
                onPress={() => setObraSelecionada(obra)}
              />
            ))}
          </View>
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
            <BotaoCustomizado
              title="Adicionar Capítulo"
              onPress={adicionarCapitulo}
            />
          </View>
          
          <ScrollView style={styles.listaCapitulos}>
            {obraSelecionada.capitulos.map((cap, index) => (
              <CapituloItem
                key={index}
                numero={index + 1}
                titulo={cap.titulo}
                conteudo={cap.conteudo}
                onChangeConteudo={(text) => atualizarConteudo(index, text)}
              />
            ))}
          </ScrollView>
          <View style={styles.centeredContent}>
            <BotaoCustomizado
              title="Salvar Capítulos"
              onPress={salvarCapitulos}
              style={{ marginTop: 10 }}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  nomeObra: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  inputObra: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  listaCapitulos: {
    marginTop: 10,
    marginBottom: 15,
  },
  estatisticas: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
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
  centeredContent: {
    alignItems: 'center',
  },
});
