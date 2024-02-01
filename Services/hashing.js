const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10; 
  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
  };

  module.exports = {
    hashPassword,
  };