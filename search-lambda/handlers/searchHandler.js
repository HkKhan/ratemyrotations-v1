const { query, scan } = require("../../lambda/src/utils/dynamoDb");
const { buildResponse } = require("../../lambda/src/utils/responseBuilder");
const { TABLE_NAMES } = require("../../lambda/src/constants/config");

exports.handler = async (event) => {
  const query = event.queryStringParameters.q.toLowerCase();

  try {
    // First try exact specialty match
    const specialtyResults = await query({
      TableName: TABLE_NAMES.ROTATION_SITES,
      KeyConditionExpression: "specialty = :specialty",
      ExpressionAttributeValues: {
        ":specialty": query,
      },
    });

    // If no results, scan for hospital name or location matches
    if (!specialtyResults.Items.length) {
      const scanResults = await scan({
        TableName: TABLE_NAMES.ROTATION_SITES,
        FilterExpression:
          "contains(lower(hospitalName), :query) OR contains(lower(location), :query)",
        ExpressionAttributeValues: {
          ":query": query,
        },
      });

      return buildResponse(200, scanResults.Items);
    }

    return buildResponse(200, specialtyResults.Items);
  } catch (error) {
    console.error("Search error:", error);
    return buildResponse(500, { message: "Error performing search" });
  }
};
