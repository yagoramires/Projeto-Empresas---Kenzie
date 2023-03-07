const URL = 'http://localhost:6278';
const companyList = document.querySelector('.main__list');

const getCompanies = async () => {
  const req = await fetch(URL + '/companies');

  const res = await req.json();
  loadData(res);
  return;
};

getCompanies();

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

const loadData = (companyArray) => {
  companyArray.map((company) =>
    companyList.appendChild(createCompanyCard(company)),
  );
};
