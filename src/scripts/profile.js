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

  if (res.is_admin) {
    window.location.href = 'http://localhost:5500/src/pages/admin.html';
  }

  if (req.status !== 200) {
    window.location.href = 'http://localhost:5500/src/pages/login.html';
  }

  return;
};

const fetchUserData = async () => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/users/profile', options);
  const res = await req.json();
  console.log(res);
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

  return res;
};

const fetchCompany = async (id) => {
  const req = await fetch(URL + '/companies');
  const res = await req.json();
  const userCompany = res.filter((company) => company.uuid === id);
  return userCompany[0];
};

const updateUserProfile = async (username, email, password) => {
  const options = {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  };

  const req = await fetch(URL + '/users', options);
  console.log(await req.json());

  if (req.status === 200) {
    window.location.reload();
  }
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

const setUserDepartments = async (department) => {
  const company = await fetchCompany(department.company_uuid);

  const title = document.querySelector('.companyData__title');
  title.innerHTML = `${company.name} - ${department.name}`;

  const employeesList = document.querySelector('.companyData__employees');

  department.users.map((employee) => {
    employeesList.appendChild(createEmployeeCard(employee));
  });
};

const createEmployeeCard = (user) => {
  const card = document.createElement('div');
  card.classList.add('companyData__card');

  const name = document.createElement('p');
  name.classList.add('companyData__employeeName');
  name.innerHTML = user.username;
  const level = document.createElement('p');
  level.classList.add('companyData__employeeLevel');
  level.innerHTML = user.professional_level;

  card.append(name, level);

  return card;
};

const handleEditModal = () => {
  const modal = document.querySelector('.modal__wrapper');
  modal.showModal();

  const form = document.querySelector('.modal__form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#formName');
    const email = document.querySelector('#formEmail');
    const password = document.querySelector('#formPassword');
    updateUserProfile(name.value, email.value, password.value);
  });

  closeModal('modal__wrapper', 'closeEditProfile');
};

const closeModal = (modal, btn) => {
  const dialog = document.querySelector(`.${modal}`);
  const closeBtn = document.querySelector(`#${btn}`);

  console.log(dialog);
  closeBtn.addEventListener('click', () => {
    dialog.close();
  });
};

const loadData = async () => {
  verify();

  const userData = await fetchUserData();
  const userDepartments = await fetchUserDepartments();

  setUserData(userData);
  if (userDepartments.length > 0) {
    setUserDepartments(userDepartments[0]);
  } else {
    const companyData = document.querySelector('.companyData');
    companyData.innerHTML = '';
    const outOfWork = document.createElement('div');
    outOfWork.classList.add('companyData_outofwork');
    outOfWork.innerHTML = 'Você ainda não foi contratado';

    companyData.appendChild(outOfWork);
  }

  const editBtn = document.querySelector('.userData__btn');

  editBtn.addEventListener('click', handleEditModal);
};

loadData();
