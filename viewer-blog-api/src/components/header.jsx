import { Link } from "react-router-dom"

export default function Header() {
  return(<header>
    <h1>Nico&#39;s Blog</h1>
    <nav>
      <Link to={'/'}>Home</Link>
      <Link to={'/register'}>Register</Link>
      <Link to={'/login'}>Login</Link>
      
    </nav>
  </header>
  )
}