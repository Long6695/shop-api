"use strict";

const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
};

const REASON_STATUS_CODE = {
  OK: "Success",
  CREATED: "Created Success",
};

class SuccessResponse {
  constructor({ message, status, reasonStatusCode, data = {} }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = status;
    this.data = data;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OkResponse extends SuccessResponse {
  constructor({ message, data }) {
    super({ message, data });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({
    message,
    status = STATUS_CODE.CREATED,
    reasonStatusCode = REASON_STATUS_CODE.CREATED,
    data,
  }) {
    super({ message, status, reasonStatusCode, data });
  }
}

module.exports = {
  OkResponse,
  CreatedResponse,
};
