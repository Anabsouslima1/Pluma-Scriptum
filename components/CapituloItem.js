import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function CapituloItem({
  numero,
  titulo,
  conteudo,
  onChangeConteudo,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.titulo}>
          Capítulo {numero}: {titulo}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <>
          <TextInput
            style={styles.input}
            multiline
            value={conteudo}
            onChangeText={onChangeConteudo}
            placeholder="Escreva aqui..."
          />
          <Text>
            Palavras:{' '}
            {
              conteudo
                .replace(/\n/g, ' ')
                .trim()
                .split(/\s+/)
                .filter((p) => p.length > 0).length
            }
          </Text>
        </>
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
  titulo: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    marginTop: 10,
    minHeight: 60,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
  },
  palavras: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});
