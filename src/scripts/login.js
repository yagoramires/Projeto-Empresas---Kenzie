import { handleModal } from './header.js';
import { error } from './toast.js';

handleModal();

const URL = 'http://localhost:6278';

const registerForm = document.querySelector('.main__form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    console.log('erro');
    return;
  }

  loginUser(email, password);
});

const loginUser = async (email, password) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.toLowerCase(),
      password,
    }),
  };

  const req = await fetch(URL + '/auth/login', options);
  const res = await req.json();

  if (req.status === 200) {
    localStorage.setItem('token', res.token);
    window.location.href = 'http://localhost:5500/src/pages/profile.html';
  } else {
    error(res.error, 'toast-error');
  }
  return;
};
