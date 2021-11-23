const logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Вы вышли из системы' });
};

module.exports = logout;
