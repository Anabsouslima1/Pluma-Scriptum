import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 

export default function CapituloItem({ numero, titulo, conteudo, onChangeConteudo, onExcluir, onChangeTituloLocal, tipo }) {
  const [expanded, setExpanded] = useState(false);
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState(titulo);

  const confirmarEdicao = () => {
    if (!novoTitulo.trim()) setNovoTitulo(titulo);
    onChangeTituloLocal(novoTitulo.trim());
    setEditandoTitulo(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.tituloContainer}>
        {editandoTitulo ? (
          <TextInput
            style={styles.inputTitulo}
            value={novoTitulo}
            onChangeText={setNovoTitulo}
            onBlur={confirmarEdicao}
            onSubmitEditing={confirmarEdicao}
            autoFocus
          />
        ) : (
          <View style={styles.tituloLinha}>
            <Text style={styles.capituloTitulo}>
              {tipo === 'conto' ? `Parte ${novoTitulo}` : `Capítulo ${numero}: ${novoTitulo}`}
            </Text>

            <TouchableOpacity onPress={() => setEditandoTitulo(true)} style={styles.icone}>
              <Entypo name="edit" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {expanded && (
        <View>
          <TextInput
            style={styles.input}
            multiline
            value={conteudo}
            onChangeText={onChangeConteudo}
            placeholder="Escreva aqui..."
          />
          <Text style={styles.palavras}>
            Palavras: {conteudo.replace(/\n/g, ' ').trim().split(/\s+/).filter(p => p.length > 0).length}
          </Text>

          {editandoTitulo && (
            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={event => {
                event.stopPropagation(); // impede fechar capítulo
                onExcluir();
              }}
            >
              <Text style={styles.botaoTexto}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tituloContainer: { marginBottom: 5 },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputTitulo: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 5,
    fontSize: 16,
  },
  icone: { marginLeft: 5 },
  input: {
    minHeight: 60,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    marginBottom: 5,
  },
  palavras: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  botaoExcluir: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '600',
  },
});
