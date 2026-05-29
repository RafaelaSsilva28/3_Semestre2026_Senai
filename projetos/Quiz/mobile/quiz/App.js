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

      const resposta = await fetch('http://localhost:3001/quiz');
      const dadosJogo = await resposta.json();
      
      // LOG DOS DADOS DO BANCO:
      console.log("DADOS QUE CHEGARAM DA API:", dadosJogo);
      
      setDados(dadosJogo)
    }catch(erro){
      setMensagem("Erro ao conectar com o servidor")
    }
  }

  const alternativa = (opcao) => {
    const gabarito = dados.resposta_correta ? String(dados.resposta_correta).trim() : "";
    const opcaoEscolhida = opcao ? String(opcao).trim() : "";

    // LOG DE COMPARAÇÃO:
    console.log("CLICADO:", `'${opcaoEscolhida}'`, " | GABARITO NO BANCO:", `'${gabarito}'`);

    if(gabarito === opcaoEscolhida){
      setMensagem('🎉 ACERTOU EM CHEIO! 🎉');
    }else{
      setMensagem('❌ ERROU! QUE PENA... ❌')
    }
    setRespondido(true);
  }

  useEffect(() => {
    novaRodada()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitulo}>Desafio do Quiz</Text>
        <Text style={styles.titulo}>{dados.pergunta || "Carregando..."}</Text> 
      </View>
      
      <View style={styles.containerFoto}>
        {dados.imagem ? (
          <Image source={{ uri: dados.imagem }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder} />
        )}
      </View>

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
          mensagem.includes("ACERTOU") ? styles.bgAcertou : styles.bgErrou
        ]}>
          <Text style={styles.textoFeedback}>{mensagem}</Text>
        </View>
      )}

      {respondido && (
        <TouchableOpacity style={styles.botaoProximo} onPress={novaRodada}>
          <Text style={styles.textoProximo}>PROXIMA PERGUNTA ➡️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F172A', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 25,
    paddingHorizontal: 20
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 5
  },
  subtitulo: {
    fontSize: 11,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  titulo: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#FFFFFF', 
    textAlign: 'center', 
    lineHeight: 24
  },
  containerFoto: {
    flex: 1, 
    width: '100%',
    maxHeight: 220, 
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  foto: { 
    width: '100%',
    height: '100%',         
    resizeMode: 'contain', 
    borderRadius: 12,
  },
  fotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  containerOpcoes: { 
    width: '100%', 
    alignItems: 'center', 
    gap: 8, 
  },
  botaoAlternativa: { 
    width: '95%', 
    padding: 12, 
    backgroundColor: '#1E293B', 
    borderWidth: 2, 
    borderColor: '#4F46E5', 
    borderRadius: 12, 
    alignItems: 'center',
  },
  botaoDesabilitado: { 
    borderColor: '#334155', 
    opacity: 0.4 
  }, 
  textoBotao: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#E2E8F0' 
  },
  cardFeedback: { 
    width: '95%', 
    padding: 10, 
    borderRadius: 12, 
    alignItems: 'center', 
    borderWidth: 2,
    marginTop: 5,
  },
  bgAcertou: { 
    backgroundColor: '#064E3B', 
    borderColor: '#10B981' 
  }, 
  bgErrou: { 
    backgroundColor: '#7F1D1D', 
    borderColor: '#EF4444' 
  },     
  textoFeedback: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    textAlign: 'center' 
  },
  botaoProximo: { 
    backgroundColor: '#818CF8', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 12, 
    marginTop: 5,
  },
  textNuvesm:{
    color:'#FFFFFF'
  },
  textoProximo: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#0F172A', 
    textTransform: 'uppercase' 
  }
});
