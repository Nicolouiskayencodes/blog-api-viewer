import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/header.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'
import User from './components/user.jsx'
import Posts from './components/posts.jsx'


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const {page} = useParams()
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [reload, setReload] = useState(false)
  console.log(posts)
  function assignUser(userObj) {
    setUser(userObj)
  }
  useEffect(()=>{
    setReload(false)
    const token = localStorage.getItem("Authorization");
    console.log({"Authorization": token})
    fetch('https://blog-api-backend-0ye2.onrender.com/protected', {mode: 'cors', method:"GET", headers:{
      "Authorization": token,
      "Content-Type": "application/json"
    }})
    .then(response=>{ 
      if (response.status === 401) {
        setUser(null)
        throw new Error("Expired token");
      }
      return response.json()})
    .then(response=>setUser(response))
    fetch('https://blog-api-backend-0ye2.onrender.com/posts', {mode: 'cors', method: "GET", headers:{
      "Content-Type": "application/json",
    }})
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()})
    .then(response=>setPosts(response))
    .catch(error=>console.log(error))
    .finally(()=> setLoading(false))
  }, [navigate, location.pathname, location.search, reload])
  return (
    <>
      <Header setUser={assignUser} user={user}/>
      {page === 'register' ? (
        <Register />
      ) : page === 'login' ? (
        <Login setUser={assignUser}/>
      ) : (
        (loading && <p>Loading...</p>),
        <>
          <User user={user}/>
          <Posts posts={posts} reload={setReload} user={user}/>
        </>
      )}
    </>
  )
}

export default App
