import { useState, useEffect } from "react"
import { Text, View, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Principal() {

   const [dadoslogin, setDadosLogin] = useState(null)

  useEffect(() => {
    async function buscarUsuario(){
      const UsuarioLogado = await AsyncStorage.getItem('UsuarioLogado')
      if (UsuarioLogado){
        setDadosLogin(JSON.parse(UsuarioLogado))
      }
    }
    buscarUsuario()
  }, [])

  function botaoLogout (){
    AsyncStorage.removeItem('UsuarioLogado')
    setDadosLogin(null)
    navigation.navigate('Login')
  }

  return (
    <View>
      {/* Linha superior com Usuário e Botão Sair */}
      <View style={{
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px', 
        borderBottom: '1px solid #ccc'
      }}>
        <Text style={{ fontSize: '18px', margin: 0 }}> 
          Usuário: {dadoslogin?.usuario?.nome || ''} ({dadoslogin?.usuario?.email || ''})
        </Text>
        <Button onPress={botaoLogout} title="Sair"/>
      </View>
      
      {/* Título Principal posicionado abaixo da linha */}
      <Text style={{ margin: '10px' }}>Principal</Text>
    </View>
  )
}