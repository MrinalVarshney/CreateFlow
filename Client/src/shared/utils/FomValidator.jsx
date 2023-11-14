export const validateLoginForm = ({ mail, password }) => {
  return validateMail(mail) && validatePassword(password);
};

export const validateRegistrationForm = ({ username, mail, password }) => {
  console.log(username,mail,password)
  return (
    validateMail(mail) &&
    validateUsername(username) &&
    validatePassword(password)
  );
};

const validatePassword = (password) => {
  return password.length > 5 && password.length < 13;
};

export const validateMail = (mail) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(mail);
};

const validateUsername = (username) => {
  return username.length > 2 && username.length < 13;
};
