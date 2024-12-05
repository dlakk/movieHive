// Select buttons and container
const signUpBtn = document.getElementById('signUp');
const signInBtn = document.getElementById('signIn');
const formContainer = document.getElementById('container');

// Add event listeners to toggle the active class
signUpBtn.addEventListener('click', () => {
  formContainer.classList.add('active'); // Activate sign-up view
  console.log("ctivated");
});

signInBtn.addEventListener('click', () => {
  formContainer.classList.remove('active'); // Activate sign-in view
});
