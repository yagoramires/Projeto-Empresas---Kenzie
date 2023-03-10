import { handleModal } from './header.js';

const URL = 'http://localhost:6278';
const token = localStorage.getItem('token');

// ####################################### AUTENTICACAO DE USUARIO #######################################
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

// ####################################### SESSAO DE USUARIOS #######################################
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

  modal.showModal();
  closeModal('modal__editUser', 'closeEditUser');
};

const handleDialogDeletetUser = () => {
  const modal = document.querySelector('.modal__deleteUser');

  modal.showModal();
  closeModal('modal__deleteUser', 'closeDeleteUser');
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

// ####################################### SESSAO DE DEPARTAMENTOS #######################################
// FETCH DE DADOS #######################################
const loadDepartments = async (id) => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/departments/' + id, options);
  const res = await req.json();

  return res;
};

const loadDepartment = async (id) => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const reqDep = await fetch(URL + '/departments/', options);
  const resDep = await reqDep.json();

  const department = resDep.filter((department) => department.uuid === id);

  const reqUser = await fetch(URL + '/users/', options);
  const resUser = await reqUser.json();
  const users = resUser.filter((user) => user.department_uuid === id);

  const reqOutOfWork = await fetch(URL + '/admin/out_of_work', options);
  const resOutOfWork = await reqOutOfWork.json();

  return { ...department[0], users: resOutOfWork, departmentUsers: users };
};

const loadCompanies = async () => {
  const req = await fetch(URL + '/companies');
  const res = await req.json();
  return res;
};

const hireUser = async (user, department) => {
  if (!user || !department) return;
  const options = {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_uuid: user, department_uuid: department }),
  };

  const req = await fetch(URL + '/departments/hire/', options);

  if (req.status === 200) {
    updateDepartmentUserList(department);
  }
};

const dismissUser = async (user, department) => {
  if (!user || !department) return;
  const options = {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/departments/dismiss/' + user, options);

  if (req.status === 200) {
    updateDepartmentUserList(department);
  }
};

const createDepartment = async (name, description, company_uuid) => {
  const options = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, company_uuid }),
  };

  const req = await fetch(URL + '/departments', options);

  if (req.status === 201) {
    window.location.reload();
  }
  return;
};

const updateDepartmentDescription = async (description, id) => {
  const options = {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  };

  const req = await fetch(URL + '/departments/' + id, options);
  if (req.status === 200) {
    window.location.reload();
  }
  return;
};

const deleteDepartment = async (id) => {
  const options = {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const req = await fetch(URL + '/departments/' + id, options);
  if (req.status === 204) {
    window.location.reload();
  }
  return;
};

// CRIACAO DE COMPONENTES #######################################

const createDepartmentUserCard = (user) => {
  const card = document.createElement('div');
  card.classList.add('viewDepartment__card');
  card.id = user.uuid;
  const username = document.createElement('h3');
  username.classList.add('viewDepartment__username');
  username.innerHTML = user.username;
  const level = document.createElement('p');
  level.classList.add('viewDepartment__level');
  level.innerHTML = user.professional_level;
  const company = document.createElement('p');
  company.classList.add('viewDepartment__company');
  company.innerHTML = user.kind_of_work;
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('viewDepartment__dismissContainer');
  const button = document.createElement('button');
  button.classList.add('viewDepartment__dismiss');
  button.innerHTML = 'Desligar';
  buttonContainer.appendChild(button);
  card.append(username, level, company, buttonContainer);

  return card;
};

const createDepartmentCard = (department) => {
  const card = document.createElement('div');
  card.classList.add('company__card');
  card.id = department.uuid;

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
  btnView.id = 'departmentViewBtn';
  const imgView = document.createElement('img');
  imgView.src = '../assets/view.svg';
  btnView.appendChild(imgView);

  const btnEdit = document.createElement('button');
  btnEdit.classList.add('company__btn');
  btnEdit.id = 'departmentEditBtn';
  const imgEdit = document.createElement('img');
  imgEdit.src = '../assets/edit-black.svg';
  btnEdit.appendChild(imgEdit);

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('company__btn');
  btnDelete.id = 'departmentDeleteBtn';
  const imgDel = document.createElement('img');
  imgDel.src = '../assets/trash.svg';
  btnDelete.appendChild(imgDel);

  buttonContainer.append(btnView, btnEdit, btnDelete);

  card.append(departmentName, level, company, buttonContainer);

  return card;
};

const createOption = (company) => {
  const optEl = document.createElement('option');
  optEl.value = company.uuid;
  optEl.innerHTML = company.name;

  return optEl;
};

// FUNCOES DE DEPARTAMENTOS #######################################
const emptyDepartments = () => {
  const container = document.createElement('div');
  const text = document.createElement('p');
  text.innerHTML = 'Nenhum departamento cadastrado.';

  container.appendChild(text);
  return container;
};

const handleCompanies = async () => {
  const selectCompanies = document.querySelector('.company__select');

  const companies = await loadCompanies();

  companies.forEach((company) => {
    selectCompanies.appendChild(createOption(company));
  });

  handleDepartments(selectCompanies.value);
  selectCompanies.addEventListener('click', (e) => {
    handleDepartments(e.target.value);
  });
};

const handleDepartments = async (id) => {
  const departmentList = document.querySelector('.company__cardContainer');
  const addBtn = document.querySelector('.company__addBtn');
  addBtn.id = id;

  departmentList.innerHTML = '';
  const departments = await loadDepartments(id);

  addBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal__createDepartment');
    modal.showModal();

    const form = document.querySelector('.createDepartment__form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#departmentName');
      const description = document.querySelector('#departmentDescription');
      const id = addBtn.id;

      if (name.value === '' || description.value === '') {
        return;
      } else {
        createDepartment(name.value, description.value, id);
        modal.close();
      }
      return;
    });
  });

  if (departments.length === 0) {
    departmentList.appendChild(emptyDepartments());
    return;
  }

  departments.map((department) => {
    departmentList.appendChild(createDepartmentCard(department));
  });

  departmentBtns();
  closeModal('modal__createDepartment', 'closeCreateDepartment');
  return;
};

const departmentBtns = () => {
  const viewBtns = document.querySelectorAll('#departmentViewBtn');
  const editBtns = document.querySelectorAll('#departmentEditBtn');
  const deleteBtns = document.querySelectorAll('#departmentDeleteBtn');

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentNode.parentNode.id;
      const modal = document.querySelector('.modal__viewDepartment');
      modal.showModal();
      loadDepartmentModal(id);
    });
  });

  editBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentNode.parentNode.id;
      const modal = document.querySelector('.modal__editDepartment');
      modal.showModal();
      loadEditDepartmentModal(id);
    });
  });

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentNode.parentNode.id;
      const modal = document.querySelector('.modal__deleteDepartment');
      modal.showModal();
      loadDeleteDepartmentModal(id);
    });
  });
};

const loadDepartmentModal = async (id) => {
  const department = await loadDepartment(id);
  const select = document.querySelector('.viewDepartment__selectUsers');
  closeModal('modal__viewDepartment', 'closeViewDepartment');

  select.innerHTML = '';
  department.users.forEach((user) => {
    const option = document.createElement('option');
    option.value = user.uuid;
    option.innerHTML = user.username;

    select.appendChild(option);
  });

  const hire = document.querySelector('.viewDepartment__form');
  hire.addEventListener('submit', (e) => {
    e.preventDefault();
    hireUser(select.value, id);
  });

  const departmentName = document.querySelector(
    '.viewDepartment__departmentName',
  );
  departmentName.innerHTML = department.name;
  const departmentDescription = document.querySelector(
    '.viewDepartment__description',
  );
  departmentDescription.innerHTML = department.description;
  const companyName = document.querySelector('.viewDepartment__company');
  companyName.innerHTML = department.companies.name;

  if (department.departmentUsers && department.departmentUsers.length > 0) {
    const usersList = document.querySelector('.viewDepartment__users');
    usersList.innerHTML = '';
    department.departmentUsers.forEach((user) => {
      usersList.appendChild(createDepartmentUserCard(user));
    });

    const deleteBtns = document.querySelectorAll('.viewDepartment__dismiss');

    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const userId = btn.parentNode.parentNode.id;
        dismissUser(userId, id);
      });
    });
  }
};

const updateDepartmentUserList = async (id) => {
  const department = await loadDepartment(id);
  const usersList = document.querySelector('.viewDepartment__users');

  console.log(department);

  usersList.innerHTML = '';
  if (department.departmentUsers && department.departmentUsers.length > 0) {
    department.departmentUsers.forEach((user) => {
      usersList.appendChild(createDepartmentUserCard(user));
    });

    const deleteBtns = document.querySelectorAll('.viewDepartment__dismiss');

    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        console.log(btn);
        const userId = btn.parentNode.parentNode.id;
        dismissUser(userId, id);
      });
    });
  }
};

const loadEditDepartmentModal = async (id) => {
  const department = await loadDepartment(id);
  const textarea = document.querySelector('#editDepartmentDescription');
  textarea.value = department.description;

  const form = document.querySelector('.editDepartment__form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    updateDepartmentDescription(textarea.value, id);
  });
  closeModal('modal__editDepartment', 'closeEditDepartment');
};

const loadDeleteDepartmentModal = async (id) => {
  const department = await loadDepartment(id);
  const title = document.querySelector('.deleteDepartment__title');
  title.innerHTML = `Realmente deseja deletar o departamento <span style="color:red">${department.name}</span> e demitir seus funcionários?`;

  const deleteBtn = document.querySelector('.deleteDepartment__button');
  deleteBtn.addEventListener('click', () => {
    deleteDepartment(id);
  });

  closeModal('modal__deleteDepartment', 'closeDeleteDepartment');
};

const closeModal = (modal, btn) => {
  const dialog = document.querySelector(`.${modal}`);
  const closeBtn = document.querySelector(`#${btn}`);

  console.log(dialog);
  closeBtn.addEventListener('click', () => {
    dialog.close();
  });
};

const loadPage = () => {
  handleModal();
  verify();
  handleCompanies();
  handleUsers();
};
loadPage();
