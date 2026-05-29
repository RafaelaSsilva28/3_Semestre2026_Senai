import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Principal() {
  // 1. CORRIGIDO: Nome da função de alteração de estado (setDadosLogin)
  const [dadoslogin, setDadosLogin] = useState(null)
  
  // 2. CORRIGIDO: useNavigate é uma função que precisa ser executada ()
  const navigate = useNavigate()

  useEffect(() => {
    async function buscarUsuario(){
      const UsuarioLogado = await localStorage.getItem('UsuarioLogado')
      if (UsuarioLogado){
        // 3. CORRIGIDO: Chamada da função com o nome correto
        setDadosLogin(JSON.parse(UsuarioLogado))
      }
    }
    buscarUsuario()
  }, [])

  function botaoLogout (){
    localStorage.removeItem('UsuarioLogado')
    setDadosLogin(null)
    navigate('/')
  }

  return (
    <div>
      {/* Linha superior com Usuário e Botão Sair */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px', 
        borderBottom: '1px solid #ccc'
      }}>
        <p style={{ fontSize: '18px', margin: 0 }}> 
          Usuário: {dadoslogin?.usuario?.nome || ''} ({dadoslogin?.usuario?.email || ''})
        </p>
        <button onClick={botaoLogout}>Sair</button>
      </div>
      
      {/* Título Principal posicionado abaixo da linha */}
      <h2 style={{ margin: '10px' }}>Principal</h2>
    </div>
  )
}
