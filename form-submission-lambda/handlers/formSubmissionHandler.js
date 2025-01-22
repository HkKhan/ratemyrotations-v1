const { v4: uuidv4 } = require("uuid");
const { query, put, update } = require("../utils/dynamoDb");
const { buildResponse } = require("../utils/responseBuilder");
const { TABLE_NAMES } = require("../constants/config");

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const siteId = uuidv4();
  const reviewId = uuidv4();

  try {
    // Check if site already exists
    const existingSite = await query({
      TableName: TABLE_NAMES.ROTATION_SITES,
      KeyConditionExpression: "specialty = :specialty",
      FilterExpression: "hospitalName = :hospitalName",
      ExpressionAttributeValues: {
        ":specialty": body.specialty,
        ":hospitalName": body.hospitalName,
      },
    });

    if (!existingSite.Items.length) {
      // Create new site
      await put({
        TableName: TABLE_NAMES.ROTATION_SITES,
        Item: {
          siteId: siteId,
          specialty: body.specialty,
          hospitalName: body.hospitalName,
          location: body.location,
          averageRating: body.review.rating,
          totalReviews: 1,
          reviews: [reviewId],
        },
      });
    } else {
      // Update existing site
      await update({
        TableName: TABLE_NAMES.ROTATION_SITES,
        Key: {
          siteId: existingSite.Items[0].siteId,
          specialty: body.specialty,
        },
        UpdateExpression:
          "set totalReviews = totalReviews + :inc, reviews = list_append(reviews, :reviewId), averageRating = :newAvg",
        ExpressionAttributeValues: {
          ":inc": 1,
          ":reviewId": [reviewId],
          ":newAvg":
            (existingSite.Items[0].averageRating *
              existingSite.Items[0].totalReviews +
              body.review.rating) /
            (existingSite.Items[0].totalReviews + 1),
        },
      });
    }

    return buildResponse(200, { message: "Review submitted successfully" });
  } catch (error) {
    console.error("Submission error:", error);
    return buildResponse(500, { message: "Error submitting review" });
  }
};
