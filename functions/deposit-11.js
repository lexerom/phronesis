const RebillyAPI = require("rebilly-js-sdk").default;
require("dotenv").config();

const REBILLY_API_SECRET_KEY = process.env.API_KEY;
const REBILLY_ORGANIZATION_ID = process.env.ORG_ID;
const REBILLY_WEBSITE_ID = process.env.WEBSITE_ID;
const rebilly = RebillyAPI({
    sandbox: process.env.ENV === "sandbox",
    apiKey: REBILLY_API_SECRET_KEY,
    organizationId: REBILLY_ORGANIZATION_ID,
});

exports.handler = async function (event, context, callback) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        const requestDepositData = {
            websiteId: REBILLY_WEBSITE_ID,
            customerId: CUSTOMER_ID,
            currency: "USD",
            strategyId: "dep_str_01JAAK5MKPX6D0RGHCBCPP4NW0",
        };
        const { fields: depositFields } = await rebilly.depositRequests.create({
            data: requestDepositData,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                transaction,
            }),
        };
    } catch (error) {
        const message = error.details ?? "Internal Server Error";
        const code = error.status ?? 500;

        return JSON.stringify({
            code,
            message,
        })
    }

}