const User = require('../models/userModel');

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

  static createUser(req, res) {
    const newUser = new User(Date.now().toString(), req.body.name, req.body.email);
    User.create(newUser);
    res.status(201).json(newUser);
  }

  static updateUser(req, res) {
    const updatedUser = new User(req.params.id, req.body.name, req.body.email);
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
}

module.exports = UserController;
