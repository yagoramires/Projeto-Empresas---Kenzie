import { handleModal } from './header.js';
import { handleSelect, handleCompanies, handleSelectFilter } from './home.js';

const loadPage = () => {
  handleModal();
  handleSelect();
  handleCompanies();
  handleSelectFilter();
};

loadPage();
