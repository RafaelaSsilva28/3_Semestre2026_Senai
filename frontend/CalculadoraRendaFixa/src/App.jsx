import './App.css'
//importando nossas routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/Navbar'
import Calculadora from './pages/Calculadora'
import Sobre from './pages/Sobre'
function App(){
  return(

//browserRouter abilita o sistemade navegação por rotas
    <BrowserRouter>
    {/* {Barra de navegação que aparece em todas as paginas} */}
    <NavBar/>
      {/* Area de conteudo principal */}
      <main className='conteudo-principal'>
      <Routes>
          <Route path='/' element={<Calculadora />}/>
          <Route path='/sobre' element={<Sobre />}/>
      </Routes>
    </main>
    </BrowserRouter>
  )
}



export default App