const User = require('../models/userModel');
const bcrypt = require('bcrypt')

class UserController {
  static getAllUsers(req, res) {
    res.json(User.findAll());
  }

  static getUserById(req, res) {
    const user = User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }

  static async createUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Kirim data ke model untuk proses pembuatan pengguna
      const newUser = await User.create({ name, email, password });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }

  static updateUser(req, res) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const updatedUser = new User(req.params.id, req.body.name, req.body.email, hashedPassword);
    const user = User.update(req.params.id, updatedUser);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }

  static deleteUser(req, res) {
    const user = User.delete(req.params.id);
    if (user) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }

  static loginUser(req, res) {
    const user = User.findByEmail(req.body.email); // Cari pengguna berdasarkan email
    if (user) {
      const isPasswordValid = bcrypt.compareSync(req.body.password, user.password); // Bandingkan password
      if (isPasswordValid) {
        res.json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ message: 'Invalid credentials' }); // Password tidak cocok
      }
    } else {
      res.status(404).json({ message: 'User not found' }); // Pengguna tidak ditemukan
    }
  }
}

module.exports = UserController;
