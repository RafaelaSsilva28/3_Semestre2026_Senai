import {View, Text, TextInput, TouchableOpacity, Image, Switch} from 'react-native';
import { useState } from 'react';
import { enderecoServidor } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LinearGradient} from 'expo-linear-gradient'
import {MaterialIcons} from '@expo/vector-icons'
import { EstilosLogin } from '../styles/EstilosLogin';
import { corFundo2, corPrincipal } from '../styles/Estilos';
export default function Login ({navigation}) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    async function botaoEntrar() {
        try {
            if (email == '' || senha == '') {
                setMensagem('Preencha todos os campos');
                return;
            }
            const login = {
                "email": email,
                "senha": senha
            }
            const resposta = await fetch(`${enderecoServidor}/login`, {
                method: 'POST',     
                headers: {          
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)  
            })
            if (resposta.status == 400) {
                setMensagem(`Rota de Login não encontrada: ${resposta.url}`);
                return;
            }
            const dados = await resposta.json(); 
    
            if (resposta.status == 500) {
                setMensagem(dados.error);
                return;
            }
    
            if (resposta.ok) { 
                AsyncStorage.setItem('UsuarioLogado', JSON.stringify(dados)); 
                navigation.navigate('MenuDrawer'); 
            } else {
                setMensagem('❌ Email ou senha inválidos'); 
            }
        } catch(erro) {
            setMensagem(`Erro ao fazer login: ${erro.message}`);
        }
      }

    return (
        <View>
            <Text>Tela de Login</Text>
            <Text>Email</Text>
            <TextInput placeholder="Digite seu email"
            value={email} onChangeText={setEmail} />

            <Text>Senha</Text>
            <TextInput placeholder="Digite sua senha" secureTextEntry={true} 
            value={senha} onChangeText={setSenha} />

            <Button title="Entrar" onPress={botaoEntrar} />
            <Text style={{color: 'red'}}>{mensagem}</Text>
        </View>
    )
}