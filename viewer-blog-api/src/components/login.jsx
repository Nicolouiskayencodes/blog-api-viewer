import { useRef } from "react"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const username = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const resonseObj = await fetch("http://localhost:3000/login", {
      mode: "cors",
      method: "POST", body: JSON.stringify({
        username: username.current.value,
        password: password.current.value,
      }),
      headers: { "Content-Type": "application/json" },
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()})
      console.log(resonseObj)
      localStorage.setItem("Authorization", `Bearer: ${resonseObj.token}`)
      navigate('/home');
  }
  return(<div>
    <form onSubmit={handleSubmit}>
      <label>Username: 
        <input ref={username} name="username" type="text"></input>
      </label>
      <label>Password: 
        <input ref={password} name="password" type="password"></input>
      </label>
      <button type="submit">Submit</button>
    </form>
  </div>)
}