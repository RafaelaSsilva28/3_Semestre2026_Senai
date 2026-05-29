import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function App() {
  const [dados, setDados] = useState({opcoes: []});
  const [respondido, setRespondido] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const novaRodada = async() => {
    try{
    setRespondido(false);
    setMensagem('');

    const resposta = await fetch('http://localhost:3001/jogo');
    const dadosJogo = await resposta.json();
    setDados(dadosJogo)
    }catch(erro){
      setMensagem("Erro ao conectar com o servidor")
    }
  }
  const alternativa = (opcao) => {
    const gabarito = dados.respostaCorreta
    const opcaoEscolhida = opcao

    //comparando a opcao escolhida com o gabarito
    if(gabarito === opcaoEscolhida){
      setMensagem('✅Acertou✅');
    }else{
      setMensagem('❌Errou❌')
    }
    setRespondido(true);
  }
  useEffect(() => {
    novaRodada()
  }, [])

  return (
    <View style={styles.container}>
       <Text style={styles.titulo}>De qual país é essa bandeira?</Text>
      
      {/* Imagem limpa sem condicionais confusas */}
      <Image source={{ uri: dados.imagem }} style={styles.foto} />

      <View style={styles.containerOpcoes}>
        {dados.opcoes.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.botaoAlternativa, respondido && styles.botaoDesabilitado]} 
            onPress={() => alternativa(item)}
            disabled={respondido} 
          >
            <Text style={styles.textoBotao}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mensagem !== "" && (
        <View style={[
          styles.cardFeedback, 
          mensagem.includes("Acertou") ? styles.bgAcertou : styles.bgErrou
        ]}>
          <Text style={styles.textoFeedback}>{mensagem}</Text>
        </View>
      )}

      {respondido && (
        <TouchableOpacity style={styles.botaoProximo} onPress={novaRodada}>
          <Text style={styles.textoProximo}>PRÓXIMO PAÍS ➡️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 21, fontWeight: '700', color: '#1F2937', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase' },
  textoCarregando: { fontSize: 16, color: '#4B5563', fontWeight: '500' },
  foto: { width: 290, height: 180, resizeMode: 'contain', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', marginVertical: 15, elevation: 4 },
  containerOpcoes: { width: '100%', alignItems: 'center', gap: 12 },
  botaoAlternativa: { width: '90%', padding: 16, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#3B82F6', borderRadius: 12, alignItems: 'center', elevation: 1 },
  botaoDesabilitado: { borderColor: '#D1D5DB', opacity: 0.6 }, 
  textoBotao: { fontSize: 16, fontWeight: '600', color: '#1D4ED8' },
  cardFeedback: { width: '90%', padding: 16, borderRadius: 12, marginTop: 20, alignItems: 'center', borderWidth: 1, elevation: 2 },
  bgAcertou: { backgroundColor: '#D1FAE5', borderColor: '#10B981' }, 
  bgErrou: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },     
  textoFeedback: { fontSize: 15, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  botaoProximo: { marginTop: 20, backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, elevation: 3 },
  textoProximo: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase' }
});
