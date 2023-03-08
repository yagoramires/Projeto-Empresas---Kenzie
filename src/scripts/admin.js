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

  handleUserBtns();
};

const createUserCard = (user) => {
  const card = document.createElement('div');
  card.classList.add('companyUsers__card');
  card.id = user.uuid;

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
  const btnDelete = document.createElement('button');
  btnDelete.classList.add('companyUsers__btn');
  btnDelete.id = 'delete';
  const imgDel = document.createElement('img');
  imgDel.src = '../assets/trash.svg';
  btnDelete.appendChild(imgDel);
  const btnEdit = document.createElement('button');
  btnEdit.classList.add('companyUsers__btn');
  btnEdit.id = 'edit';

  const imgEdit = document.createElement('img');
  imgEdit.src = '../assets/edit-purple.svg';
  btnEdit.appendChild(imgEdit);
  buttonContainer.append(btnEdit, btnDelete);

  card.append(username, level, company, buttonContainer);

  return card;
};

const handleUserBtns = () => {
  const btnDelete = document.querySelectorAll('#delete');
  const btnEdit = document.querySelectorAll('#edit');

  btnEdit.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentNode.parentNode.id;
      handleDialogEditUser();
      handleEditUserSubmit(id);
    });
  });

  btnDelete.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentNode.parentNode.id;
      handleDialogDeletetUser();
      handleDeleteUserSubmit(id);
    });
  });
};

const handleDialogEditUser = () => {
  const modal = document.querySelector('.modal__editUser');
  const closeModal = document.querySelector('.modal__closeEditUser');

  modal.showModal();
  closeModal.addEventListener('click', () => {
    modal.close();
  });
};

const handleDialogDeletetUser = () => {
  const modal = document.querySelector('.modal__deleteUser');
  const closeModal = document.querySelector('.modal__closeDeleteUser');

  modal.showModal();
  closeModal.addEventListener('click', () => {
    modal.close();
  });
};

const handleDeleteUserSubmit = (id) => {
  const deleteBtn = document.querySelector('.modal__deleteUserBtn');

  deleteBtn.addEventListener('click', () => {
    deleteUser(id);
  });
};

const handleEditUserSubmit = (id) => {
  const formEdit = document.querySelector('.modal__editUserForm');
  const workType = document.querySelector('#type');
  const professionalLevel = document.querySelector('#level');

  formEdit.addEventListener('submit', (e) => {
    e.preventDefault();
    const userData = {
      kind_of_work: workType.value,
      professional_level: professionalLevel.value,
    };

    editUser(userData, id);
  });
};

const editUser = async (userData, id) => {
  const options = {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  };

  const req = await fetch(URL + '/admin/update_user/' + id, options);

  if (req.status === 200) {
    handleUsers();
    const modal = document.querySelector('.modal__editUser');
    modal.close();
  }
};

const deleteUser = async (id) => {
  const options = {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/admin/delete_user/' + id, options);

  if (req.status === 204) {
    handleUsers();
    const modal = document.querySelector('.modal__deleteUser');
    modal.close();
  }
};

const handleDepartments = async () => {
  const departmentList = document.querySelector('.company__cardContainer');

  // departmentList.innerHTML = '';
  const departments = await loadDepartments();

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
