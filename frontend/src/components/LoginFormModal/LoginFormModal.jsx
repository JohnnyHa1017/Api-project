import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isButtonEnabled = credential.length >= 4 && password.length >= 6;

  const loginDemoUser = async () => {
    setErrors({});
    const demoCredential = "Demo-lition";
    const demoPassword = "password";

    try {
      await dispatch(sessionActions.login({ credential: demoCredential, password: demoPassword }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ message: "The provided credentials were invalid" });
      }
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          <input
            type='text'
            className="credential"
            value={credential}
            placeholder='Username or Email'
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="password"
            type='password'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.message && <p className="error-message">{errors.message}</p>}
        <button className="submit" type='submit' disabled={!isButtonEnabled}>
          Log In
        </button>
        <button
          className='demo-user'
          onClick={loginDemoUser}
        >
          Demo-User
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
