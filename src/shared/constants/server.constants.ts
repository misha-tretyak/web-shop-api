export const CREATE_ERROR_MSG = (type: string) =>
  `Something went wrong with creating ${type}`;
export const CREATE_ERROR_TYPE = (type: string) => `CREATE_ERROR_${type}`;

export const UPDATE_ERROR_MSG = (type: string) =>
  `Something went wrong with updating ${type}`;
export const UPDATE_ERROR_TYPE = (type: string) => `UPDATE_ERROR_${type}`;

export const DELETE_ERROR_MSG = (type: string) =>
  `Something went wrong with deleting ${type}`;
export const DELETE_ERROR_TYPE = (type: string) => `DELETE_ERROR_${type}`;

export const GET_ERROR_MSG = (type: string) =>
  `Something went wrong with getting ${type}`;
export const GET_ERROR_TYPE = (type: string) => `GET_ERROR_${type}`;

export const NOT_EXIST_TYPE = (type: string) => `${type}_NOT_EXIST`;
export const NOT_EXIST_MSG = (type: string) =>
  `${type} not exist with this param`;

export const INVALID_TOKEN = (type: string) =>
  `${type} Token expired or cannot be validated`;

export const SERVER_ERROR_MSG = 'Something went wrong';

export const RAW_QUERY_ERROR_MSG = (type: string) =>
  `Something went wrong with raw sql query ${type}`;
export const RAW_QUERY_ERROR_TYPE = (type: string) => `RAW_QUERY_${type}`;

export const REPEATED_SOFT_DELETED_ERROR = (type: string) => ({
  message: `The user is trying to create a ${type} already soft deleted`,
  code: '409',
});
