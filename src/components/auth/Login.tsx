import axios from 'axios';
import React, { useState } from 'react'

interface ILoginProps{
  setIsLoggedIn: React.Dispatch<React.SetStateAction<string | null>>
}

const Login:React.FC<ILoginProps>= ({setIsLoggedIn}) => {
  const [login, setLogin] = useState({email:'', password:''});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({...login, [e.target.name]: e.target.value});
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(login);
    try {
      const response = await axios.post('http://localhost:3000/login', login);
      const { token } = response.data;
      localStorage.setItem('accessToken', token);
      setIsLoggedIn(token);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={login.email}
            onChange={onChange}
            required
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={login.password}
            onChange={onChange}
            required
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login