const bcrypt = require("bcrypt");
const db = require("../database/knex.js")

const saltRounds = 10;

const users = [];

class User {
  
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static findAll() {
    return users;
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static async create({ name, email, password }) {
    if (!password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [{ id }] = await db("users")
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .returning("id");
    return { id, name, email };
  }

  static update(id, updatedUser) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = updatedUser;
      return updatedUser;
    }
    return null;
  }

  static delete(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      return users.splice(index, 1);
    }
    return null;
  }
  static async verifyPassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
}

module.exports = User;