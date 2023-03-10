export const success = (message) => {
  createToast(message, 'toast-success');
  return;
};

export const error = (message) => {
  createToast(message, 'toast-error');
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
