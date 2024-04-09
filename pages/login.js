import styles from '../styles/Login.module.css';
import { loginSuccess } from '../reducers/authReducer';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function Login() {
  const dispatch = useDispatch();
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);


  console.log(isAuthenticated)
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/publish-article');
    }
  }, [isAuthenticated, router]);
  


  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };


    try {
      const response = await fetch(`https://justicelib-blog-backend.vercel.app/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (response.ok) {
        dispatch(loginSuccess({token: responseData.token, email: responseData.email}));
        router.push('/publish-article')
      } else {
        console.error('Login error');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return(
    <div className={styles.loginBox}>
      <div className={styles.loginContainer}>
        <h1>Justicelib</h1>
        <div className={styles.inputContainer}>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label>Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    </div>
  );
};

export default Login;

