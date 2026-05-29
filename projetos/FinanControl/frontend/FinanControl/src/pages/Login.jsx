import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { enderecoServidor } from '../utils';
import logo from '../assets/logo.png';
import { EstilosLogin } from '../styles/EstilosLogin';
import { MdEmail, MdLock, MdSend, MdVisibility, MdVisibilityOff  } from 'react-icons/md';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);


  // ADICIONADO 'async' ANTES DA FUNÇÃO
  async function botaoEntrar(event) {
    event.preventDefault(); 
    try {
        if (email == '' || senha == '') {
            setMensagem('Preencha todos os campos');
            return;
        }
        const dadoslogin = {
            "email": email,
            "senha": senha
        }
        const resposta = await fetch(`${enderecoServidor}/login`, {
            method: 'POST',     
            headers: {          
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadoslogin)  
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
            localStorage.setItem('UsuarioLogado', JSON.stringify({...dados, lembrar})); 
            navigate('/principal'); 
        } else {
            setMensagem('❌ Email ou senha inválidos'); 
        }
    } catch(erro) {
        setMensagem(`Erro ao fazer login: ${erro.message}`);
    }
  }
   function alternarVisibilidadeSenha(){
    setMostrarSenha(!mostrarSenha)
   }
  return (
    <div style={EstilosLogin.container}>
        <header style={EstilosLogin.cabecalho}>
            <img src={logo}style={EstilosLogin.iconeLogo} />
            <div>
                <h1 style={EstilosLogin.nomeApp}>FinanControl</h1>
                <p style={EstilosLogin.subtituloApp}>O Seu Contrle Financeiro</p>
            </div>
        </header>

        <main style={EstilosLogin.conteudoPrincipal}>
            <form style={EstilosLogin.formularioLogin}>
                <h2 style={EstilosLogin.titulo}>Acesse sua conta</h2>

                <div style={EstilosLogin.grupoInput}>
                    <MdEmail style={EstilosLogin.iconeInput}/>
                    <input type="email" style={EstilosLogin.input}
                        placeholder='Digite seu email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div style={EstilosLogin.grupoInput}>
                    <MdLock style={EstilosLogin.iconeInput}/>
                    <input 
                    type={mostrarSenha == true ? 'text' : 'password'}
                    style={EstilosLogin.input}
                        placeholder='Digite sua senha'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <button type='button' onClick={alternarVisibilidadeSenha}
                        style={EstilosLogin.alternarVisibilidade}>
                        {mostrarSenha == true ? <MdVisibility/> : <MdVisibilityOff/>}

                    </button>
                </div>

                <div style={EstilosLogin.entreOpcoes}>
                    <div style={EstilosLogin.containerCheckbox}>
                        <input type="checkbox" style={EstilosLogin.checkbox}
                        checked={lembrar} onChange={(e) => setLembrar(e.target.checked)}/>
                        <label>Lembrar-me</label>
                    </div>
                    <a href="#" style={EstilosLogin.esqueceuSenha}>Esqueceu a senha?</a>
                </div>
                <button type='submit' style={EstilosLogin.botaoEntrar} onClick={botaoEntrar}>Entrar</button>
                <p style={EstilosLogin.mensagemFeedback}>{mensagem}</p>
            </form>
        </main>

    </div>
);
}
