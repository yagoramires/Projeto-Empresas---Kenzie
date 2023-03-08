const URL = 'http://localhost:6278';

const fetchSelectOptions = async () => {
  const req = await fetch(URL + '/sectors');
  const res = await req.json();
  return res;
};

const fetchCompanies = async () => {
  const req = await fetch(URL + '/companies');
  const res = await req.json();

  return res;
};

const fetchCompaniesFiltered = async (filter) => {
  const req = await fetch(URL + '/companies/' + filter);
  const res = await req.json();

  // console.log(res);
  return res;
};

export const handleSelect = async () => {
  const select = document.querySelector('.main__filterBtn');
  const options = await fetchSelectOptions();

  options.forEach((option) => {
    select.appendChild(createOption(option));
  });
};

const createOption = (option) => {
  const optEl = document.createElement('option');
  optEl.classList.add('main__option');
  optEl.innerHTML = option.description;

  return optEl;
};

export const handleCompanies = async () => {
  const companyList = document.querySelector('.main__list');

  companyList.innerHTML = '';
  const companies = await fetchCompanies();

  companies.map((company) => {
    companyList.appendChild(createCompanyCard(company));
  });
};

const createCompanyCard = (company) => {
  const card = document.createElement('li');
  card.classList.add('main__card');
  const title = document.createElement('h2');
  title.classList.add('main__cardTitle');
  title.innerHTML = company.name;
  const text = document.createElement('p');
  text.classList.add('main__cardText');
  text.innerText = company.description;
  const opening = document.createElement('p');
  opening.classList.add('main__cardText');
  opening.innerText = company.opening_hours;
  const sector = document.createElement('span');
  sector.classList.add('main__cardSector');
  sector.innerHTML = company.sectors.description;

  card.append(title, text, opening, sector);

  return card;
};

export const handleSelectFilter = () => {
  const select = document.querySelector('.main__filterBtn');
  select.addEventListener('click', async (e) => {
    if (e.target.value === 'select') {
      handleCompanies();
      return;
    }

    const companyList = document.querySelector('.main__list');
    companyList.innerHTML = '';

    const companiesFiltered = await fetchCompaniesFiltered(e.target.value);

    companiesFiltered.map((company) => {
      companyList.appendChild(createCompanyCard(company));
    });
  });
};
