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
        const {
            paymentToken,
            billingAddress: primaryAddress,
            currency,
            amount,
            replays,
            partners,
        } = JSON.parse(event.body);
        const { fields: customer } = await rebilly.customers.create({
            data: {
                paymentToken,
                primaryAddress
            },
        });
        const { fields: transaction } = await rebilly.transactions.create({
            data: {
                type: "sale",
                websiteId: REBILLY_WEBSITE_ID,
                customerId: customer.id,
                currency,
                amount,
                customFields: {
                    Replays: replays,
                    'Partner-name-1': JSON.stringify(partners),
                },
            },
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