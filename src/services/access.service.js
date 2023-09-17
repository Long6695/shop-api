"use strict";
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const TokenService = require("./token.service");
const { createTokenPair } = require("../auth/auth");
const { getInfoData } = require("../ultis");
const {
  ConflictErrorResponse,
  UnauthorizedResponse,
} = require("../core/error.response");

const UserRole = {
  ADMIN: "00000",
  WRITER: "00001",
  EDITOR: "00002",
  USER: "00003",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const existUser = await userModel.findOne({ email }).lean();
    if (existUser) {
      throw new ConflictErrorResponse("Email has registered already!");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
      roles: [UserRole.USER],
    });

    if (newUser) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });
      const publicKeyString = await TokenService.createToken({
        userId: newUser?._id,
        publicKey,
      });

      if (!publicKeyString) {
        throw new UnauthorizedResponse();
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      const tokens = await createTokenPair(
        {
          userId: newUser?._id,
          email,
        },
        publicKeyObject,
        privateKey
      );
      return {
        user: getInfoData({
          fields: ["_id", "email", "name"],
          object: newUser,
        }),
        tokens,
      };
    }
  };
}

module.exports = AccessService;
