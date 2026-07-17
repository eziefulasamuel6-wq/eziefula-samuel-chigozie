/* =========================================================
   COS 106 STUDENT PORTFOLIO — SCRIPT.JS
   Shared across all pages. Handles: mobile nav toggle,
   homepage typing effect, academic planner, contact validation.
   Each function checks whether its target elements exist on
   the current page before running, so one file works everywhere.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initTypingEffect();
  initPlanner();
  initContactForm();
});

/* ---------------------------------------------------------
   1. Mobile nav toggle (every page)
--------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ---------------------------------------------------------
   2. Hero terminal typing effect (index.html only)
--------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById('typeLine');
  if (!el) return;

  const message = 'eziefula_samuel — cybersecurity student';
  let index = 0;

  function type() {
    if (index <= message.length) {
      el.textContent = message.slice(0, index);
      index += 1;
      setTimeout(type, 55);
    }
  }
  type();
}

/* ---------------------------------------------------------
   3. Academic Planner (planner.html only)
--------------------------------------------------------- */
function initPlanner() {
  const form = document.getElementById('taskForm');
  const input = document.getElementById('taskInput');
  const list = document.getElementById('taskList');
  const emptyState = document.getElementById('taskEmptyState');
  const countLabel = document.getElementById('taskCountLabel');
  const doneLabel = document.getElementById('taskDoneLabel');

  if (!form) return;

  /** @type {{id: number, text: string, complete: boolean}[]} */
  let tasks = [];
  let nextId = 1;

  function render() {
    list.innerHTML = '';

    if (tasks.length === 0) {
      emptyState.classList.remove('is-hidden');
      list.classList.add('is-hidden');
    } else {
      emptyState.classList.add('is-hidden');
      list.classList.remove('is-hidden');

      tasks.forEach((task) => {
        const item = document.createElement('li');
        item.className = 'task-item' + (task.complete ? ' is-complete' : '');
        item.dataset.id = String(task.id);

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;

        const checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.className = 'task-check';
        checkBtn.textContent = task.complete ? 'Undo' : 'Complete';
        checkBtn.addEventListener('click', () => toggleTask(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'task-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        item.append(text, checkBtn, deleteBtn);
        list.appendChild(item);
      });
    }

    const completedCount = tasks.filter((t) => t.complete).length;
    countLabel.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;
    doneLabel.textContent = `${completedCount} completed`;
  }

  function addTask(text) {
    tasks.push({ id: nextId, text, complete: false });
    nextId += 1;
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, complete: !task.complete } : task
    );
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    render();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (value === '') return;
    addTask(value);
    input.value = '';
    input.focus();
  });

  render();
}

/* ---------------------------------------------------------
   4. Contact form validation (contact.html only)
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('nameField'),
      error: document.getElementById('nameError'),
    },
    email: {
      input: document.getElementById('emailField'),
      error: document.getElementById('emailError'),
    },
    phone: {
      input: document.getElementById('phoneField'),
      error: document.getElementById('phoneError'),
    },
    message: {
      input: document.getElementById('messageField'),
      error: document.getElementById('messageError'),
    },
  };

  const statusEl = document.getElementById('formStatus');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnlyPattern = /^[0-9]+$/;

  function setError(fieldKey, message) {
    const { input, error } = fields[fieldKey];
    input.closest('.form-row').classList.add('has-error');
    error.textContent = message;
  }

  function clearError(fieldKey) {
    const { input, error } = fields[fieldKey];
    input.closest('.form-row').classList.remove('has-error');
    error.textContent = '';
  }

  function validate() {
    let isValid = true;

    const nameValue = fields.name.input.value.trim();
    if (nameValue === '') {
      setError('name', 'Please enter your full name.');
      isValid = false;
    } else {
      clearError('name');
    }

    const emailValue = fields.email.input.value.trim();
    if (emailValue === '') {
      setError('email', 'Please enter your email address.');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setError('email', 'Please enter a valid email address (e.g. name@example.com).');
      isValid = false;
    } else {
      clearError('email');
    }

    const phoneValue = fields.phone.input.value.trim();
    if (phoneValue === '') {
      setError('phone', 'Please enter your phone number.');
      isValid = false;
    } else if (!digitsOnlyPattern.test(phoneValue)) {
      setError('phone', 'Phone number should contain digits only, e.g. 08020970675.');
      isValid = false;
    } else {
      clearError('phone');
    }

    const messageValue = fields.message.input.value.trim();
    if (messageValue === '') {
      setError('message', 'Please write a short message.');
      isValid = false;
    } else {
      clearError('message');
    }

    return isValid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const isValid = validate();

    if (!isValid) {
      statusEl.textContent = 'Please fix the highlighted fields and try again.';
      statusEl.className = 'form-status is-error';
      return;
    }

    statusEl.textContent = 'Message sent successfully! I will get back to you soon.';
    statusEl.className = 'form-status is-success';
    form.reset();
  });

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('input', () => clearError(key));
  });
}
