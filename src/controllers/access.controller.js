"use strict";
const { CreatedResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
class AccessController {
  static signUp = async (req, res, next) => {
    new CreatedResponse({
      message: "Register success",
      data: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = AccessController;
