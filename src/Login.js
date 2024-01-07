import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        localStorage.setItem('isLoggedIn', true);
        navigate('/home');
      } else {
        setErrorMessage('Lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return (
    <div className="App vh-100 justify-content-center align-content-center d-grid " style={{ 
      backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)`, 
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }} >
    <div className="container">
      <form onSubmit={handleLogin}>
        {errorMessage && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Username Veya Parola Hatalı !</strong> {errorMessage}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setErrorMessage('')}></button>
          </div>
        )}
        <div className="mb-3">
          <label className="form-label text-light">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">  
          <label className="form-label text-light">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='justify-content-center d-grid'>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Login;
