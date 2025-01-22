const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.query = async (params) => {
  return dynamodb.query(params).promise();
};

exports.scan = async (params) => {
  return dynamodb.scan(params).promise();
};

exports.put = async (params) => {
  return dynamodb.put(params).promise();
};

exports.update = async (params) => {
  return dynamodb.update(params).promise();
};
