const users = [];

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static findAll() {
    return users;
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static create(user) {
    users.push(user);
    return user;
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
}

module.exports = User;