import {View, Text, TextInput, TouchableOpacity, Image, Switch} from 'react-native';
import { useState, useEffect } from 'react';
import { enderecoServidor } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LinearGradient} from 'expo-linear-gradient'
import {MaterialIcons} from '@expo/vector-icons'
import { coresLogin, EstilosLogin } from '../styles/EstilosLogin';
import { corFundo2, corPrincipal } from '../styles/Estilos';

export default function Login ({navigation}) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [lembrar, setLembrar] = useState(false)

    useEffect(() => {
        async function buscarUsuario(){
          const UsuarioLogado = await AsyncStorage.getItem('UsuarioLogado')
          if (UsuarioLogado){
            const usuario = JSON.parse(UsuarioLogado)
            if (usuario.lembrar == true){
                navigation.navigate('MenuDrawer')
            }
            // 3. CORRIGIDO: Chamada da função com o nome correto
            setDadosLogin(JSON.parse(UsuarioLogado))
          }
        }
        buscarUsuario()
      }, [])
       
    async function botaoEntrar() {
        try {
            if (email == '' || senha == '') {
                setMensagem('Preencha todos os campos');
                return;
            }
            const dadosLogin = {
                "email": email,
                "senha": senha
            }
            const resposta = await fetch(`${enderecoServidor}/login`, {
                method: 'POST',     
                headers: {          
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLogin)  
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
                // Colocado o await aqui para salvar os dados com segurança
                AsyncStorage.setItem('UsuarioLogado', JSON.stringify({...dados, lembrar})); 
                navigation.navigate('MenuDrawer'); 
            } else {
                setMensagem('❌ Email ou senha inválidos'); 
            }
        } catch(erro) {
            setMensagem(`Erro ao fazer login: ${erro.message}`);
        }
      }

    return (
        <View style={EstilosLogin.container}>
            <LinearGradient
                colors={[corFundo2, corPrincipal]}
                start={{ x: 0.5, y: 0}}
                end={{ x: 0.5, y: 1}}
                style={EstilosLogin.gradiente}
            >
                <View style={EstilosLogin.cabecalho}>
                    <Image source={require('../../assets/logo (1).png')} style={EstilosLogin.iconeLogo}/>
                    <View>
                        <Text style={EstilosLogin.nomeApp}>FinanControl</Text>
                        <Text style={EstilosLogin.subtituloApp}>O Seu Controle Financeiro</Text>
                    </View>
                </View>

                <View style={EstilosLogin.conteudoPrincipal}>
                    <View style={EstilosLogin.formularioLogin}>
                        <Text style={EstilosLogin.titulo}>Acesse sua conta</Text>
                        
                        {/* Campo de Email */}
                        <View style={EstilosLogin.grupoInput}>
                            <MaterialIcons name="email" size={22} style={EstilosLogin.iconeInput}/>
                            <TextInput 
                                placeholder='Digite seu email' 
                                placeholderTextColor={coresLogin.placeholder}
                                style={EstilosLogin.input} 
                                value={email} 
                                onChangeText={setEmail}
                                keyboardType='email-address' 
                                autoCapitalize='none'
                            />
                        </View>

                        {/* Campo de Senha*/}
                        <View style={EstilosLogin.grupoInput}>
                            <MaterialIcons name="lock" size={22} style={EstilosLogin.iconeInput}/>
                            <TextInput 
                                placeholder='Digite sua senha' 
                                placeholderTextColor={coresLogin.placeholder}
                                style={EstilosLogin.input} 
                                value={senha} 
                                onChangeText={setSenha}
                                secureTextEntry={!mostrarSenha}
                                autoCapitalize='none'
                            />
                            <TouchableOpacity style={EstilosLogin.alternarVisibilidade}
                                onPress={() => setMostrarSenha(!mostrarSenha)}
                            >
                                <MaterialIcons
                                size={24} color={coresLogin.icone}
                                name={mostrarSenha == true ? 'visibility-off' : 'visibility'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={EstilosLogin.entreOpcoes}>
                            <View style={EstilosLogin.containerCheckbox}>
                                <Switch value={lembrar} onValueChange={setLembrar}/>
                                <Text style={EstilosLogin.rotuloCheckbox}>Lembrar-me</Text>
                            </View>
                            <Text style={EstilosLogin.esqueceuSenha}>esqueceu a Senha?</Text>
                        </View>

                    <TouchableOpacity style={EstilosLogin.botaoEntrar} onPress={botaoEntrar}>
                        <Text style={EstilosLogin.textoBotaoEntrar}>Entrar</Text>
                    </TouchableOpacity>

                    <Text style={EstilosLogin.mensagemFeedback}>{mensagem}</Text>

                    </View>

                </View>



            </LinearGradient>
        </View>
    )
}
