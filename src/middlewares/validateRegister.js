const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" , success:false });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" , success:false });
  }

  next();
};

export default validateRegister;
