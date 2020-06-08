"use strict";

const Hash = use("Hash");
const Model = use("Model");

class User extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }
  tokens() {
    return this.hasMany("App/Models/Token");
  }
  store() {
    return this.hasOne("App/Models/Store");
  }
  purchases() {
    return this.hasMany("App/Models/Purchase");
  }
}

module.exports = User;
