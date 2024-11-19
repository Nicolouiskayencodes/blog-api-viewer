import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'
import Header from './components/header.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'
import User from './components/user.jsx'
import Posts from './components/posts.jsx'


function App() {
  const {page} = useParams()
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  useEffect(()=>{
    fetch('http://localhost:3000/posts', {mode: 'cors'})
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()})
    .then(response=>setPosts(response))
    .finally(()=> setLoading(false))
  }, [])
  return (
    <>
      <Header />
      {page === 'register' ? (
        <Register />
      ) : page === 'login' ? (
        <Login />
      ) : (
        <User />,
        (loading && <p>Loading...</p>),
        (posts && <Posts />)
      )}
    </>
  )
}

export default App
