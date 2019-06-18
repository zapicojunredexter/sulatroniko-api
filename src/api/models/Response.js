const httpStatus = require('http-status');

const {
  CREATED,
  OK,
  NO_CONTENT,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  PAYMENT_REQUIRED,
} = httpStatus;

const statusCodes = {
  CREATED,
  OK,
  NO_CONTENT,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  PAYMENT_REQUIRED,
};

const buildResponse = (message, data) => ({
  data,
  message,
});

exports.buildResponse = buildResponse;

exports.statusCodes = statusCodes;
