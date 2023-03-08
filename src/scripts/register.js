import { handleModal } from './header.js';

handleModal();

const URL = 'http://localhost:6278';

const registerForm = document.querySelector('.main__form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const levelSelect = document.querySelector('#level');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const level = levelSelect.options[levelSelect.selectedIndex].value;

  if (!name || !email || !password || level === 'select') {
    console.log('erro');
    return;
  }

  createUser(name, email, password, level);
});

const createUser = async (name, email, password, level) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: name,
      password,
      email: email.toLowerCase(),
      professional_level: level,
    }),
  };

  const req = await fetch(URL + '/auth/register', options);
  await req.json();

  if (req.status === 200) {
    window.location.href = 'http://localhost:5500/src/pages/login.html';
  }
};
