import './Navbar.css'
import { Link } from 'react-router-dom'
export default function Navbar(){
    return(
        <header className='navbar'>
            <div className='navbar-conteudo'>
                {/* Logo / Titulo */}
                <Link to='/' className='navbar-logo'>📈 Renda Fixa</Link>

                {/* {Links de navegação do menu} */}
                <nav className='navbar-links'>
                    <Link to='/' className='navbar-link'>🧮 Calculadora</Link>
                    <Link to='/sobre' className='navbar-link'>ℹ️ Sobre</Link>
                </nav>
            </div>
        </header>
    )
}