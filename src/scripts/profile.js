import { handleModal } from './header.js';

handleModal();

const URL = 'http://localhost:6278';
const token = localStorage.getItem('token');

const loadData = async () => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/auth/validate_user', options);

  const res = await req.json();

  if (res.is_admin) {
    window.location.href = 'http://localhost:5500/src/pages/admin.html';
  }

  if (req.status !== 200) {
    window.location.href = 'http://localhost:5500/src/pages/login.html';
  }

  const userData = await fetchUserData();
  const userDepartments = await fetchUserDepartments();

  if (!userDepartments.error) {
    setUserDepartments(userDepartments);
  }

  setUserData(userData);
  return;
};

loadData();

const fetchUserData = async () => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/users/profile', options);
  const res = await req.json();
  return res;
};

const fetchUserDepartments = async () => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/users/departments/coworkers', options);
  const res = await req.json();
  console.log(res);
  return res;
};

const setUserData = (user) => {
  const username = document.querySelector('#username');
  username.innerHTML = user.username;
  const email = document.querySelector('#email');
  email.innerHTML = user.email;
  const level = document.querySelector('#professional_level');
  level.innerHTML = user.professional_level;
  const type = document.querySelector('#kind_of_work');
  type.innerHTML = user.kind_of_work;
};

const setUserDepartments = (user) => {};
