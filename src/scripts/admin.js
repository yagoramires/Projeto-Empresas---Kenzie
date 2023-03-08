import { handleModal } from './header.js';

handleModal();

const URL = 'http://localhost:6278';
const token = localStorage.getItem('token');

const verify = async () => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/auth/validate_user', options);

  const res = await req.json();

  if (!res.is_admin) {
    window.location.href = 'http://localhost:5500/src/pages/profile.html';
  }

  if (req.status !== 200) {
    window.location.href = 'http://localhost:5500/src/pages/login.html';
  }
  return;
};

const loadUsers = async () => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/users', options);
  const res = await req.json();

  return res;
};

const loadDepartments = async () => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/departments', options);
  const res = await req.json();

  return res;
};

const handleUsers = async () => {
  const usersList = document.querySelector('.companyUsers__cardContainer');

  usersList.innerHTML = '';
  const users = await loadUsers();

  users.map((user) => {
    usersList.appendChild(createUserCard(user));
  });
};

const createUserCard = (user) => {
  const card = document.createElement('div');
  card.classList.add('companyUsers__card');

  const username = document.createElement('h3');
  username.classList.add('companyUsers__username');
  username.innerHTML = user.username;

  const level = document.createElement('p');
  level.classList.add('companyUsers__data');
  level.innerHTML = user.professional_level;

  const company = document.createElement('p');
  company.classList.add('companyUsers__data');
  company.innerHTML = user.kind_of_work;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('companyUsers__btnContainer');
  const btnView = document.createElement('button');
  btnView.classList.add('companyUsers__btn');
  const imgView = document.createElement('img');
  imgView.src = '../assets/view.svg';
  btnView.appendChild(imgView);
  const btnEdit = document.createElement('button');
  btnEdit.classList.add('companyUsers__btn');

  const imgEdit = document.createElement('img');
  imgEdit.src = '../assets/edit-black.svg';
  btnEdit.appendChild(imgEdit);
  buttonContainer.append(btnView, btnEdit);

  card.append(username, level, company, buttonContainer);

  return card;
};

const handleDepartments = async () => {
  const departmentList = document.querySelector('.company__cardContainer');

  // departmentList.innerHTML = '';
  const departments = await loadDepartments();

  console.log(departments);

  departments.map((department) => {
    departmentList.appendChild(createDepartmentCard(department));
  });
};

const createDepartmentCard = (department) => {
  const card = document.createElement('div');
  card.classList.add('company__card');

  const departmentName = document.createElement('h3');
  departmentName.classList.add('company__department');
  departmentName.innerHTML = department.name;

  const level = document.createElement('p');
  level.classList.add('companyDepartments__data');
  level.innerHTML = department.description;

  const company = document.createElement('p');
  company.classList.add('companyDepartments__data');
  company.innerHTML = department.companies.name;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('company__btnContainer');

  const btnView = document.createElement('button');
  btnView.classList.add('company__btn');
  const imgView = document.createElement('img');
  imgView.src = '../assets/view.svg';
  btnView.appendChild(imgView);

  const btnEdit = document.createElement('button');
  btnEdit.classList.add('company__btn');
  const imgEdit = document.createElement('img');
  imgEdit.src = '../assets/edit-black.svg';
  btnEdit.appendChild(imgEdit);

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('company__btn');
  const imgDel = document.createElement('img');
  imgDel.src = '../assets/trash.svg';
  btnDelete.appendChild(imgDel);

  buttonContainer.append(btnView, btnEdit, btnDelete);

  card.append(departmentName, level, company, buttonContainer);

  return card;
};

const loadPage = () => {
  verify();
  handleUsers();
  handleDepartments();
};
loadPage();
