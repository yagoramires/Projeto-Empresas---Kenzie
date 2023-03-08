export const handleModal = () => {
  const modalBtn = document.querySelector('.header__modalBtn');
  const modal = document.querySelector('.header__dialog');

  modalBtn.addEventListener('click', () => {
    modal.showModal();

    modal.addEventListener('click', (e) => {
      if (!e.target.classList.contains('header__logoutBtn')) {
        modal.close();
        return;
      }

      if (e.target.classList.contains('header__logoutBtn')) {
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:5500/src/pages/login.html';
        return;
      }
    });
  });

  return;
};
