export const success = (message) => {
  const body = document.querySelector('body');
  body.appendChild(createToast(message, 'toast-success'));

  setTimeout(() => {
    const toast = document.querySelector('.toast-container');
    body.removeChild(toast);
  }, 3000);
  return;
};

export const error = (message) => {
  const body = document.querySelector('body');
  body.appendChild(createToast(message, 'toast-error'));

  setTimeout(() => {
    const toast = document.querySelector('.toast-container');
    body.removeChild(toast);
  }, 3000);
  return;
};

const createToast = (message, type) => {
  const container = document.createElement('div');
  container.classList.add('toast-container');
  container.classList.add(type);
  const p = document.createElement('p');
  p.classList.add('toast-message');
  p.innerHTML = message;

  container.appendChild(p);

  return container;
};
