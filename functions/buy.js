const RebillyAPI = require("rebilly-js-sdk").default;
require("dotenv").config();

const REBILLY_API_SECRET_KEY = process.env.API_KEY;
const REBILLY_ORGANIZATION_ID = process.env.ORG_ID;
const REBILLY_WEBSITE_ID = process.env.WEBSITE_ID;
const CUSTOMER_ID = "cus_01J75YWQJ1MB7RDY74WT324C14";
const rebilly = RebillyAPI({
    sandbox: process.env.ENV === "sandbox",
    apiKey: REBILLY_API_SECRET_KEY,
    organizationId: REBILLY_ORGANIZATION_ID,
});

exports.handler = async function (event, context) {
    try {
        console.info(event);
        console.info(context);
        const order = await rebilly.subscriptions.create({
            customerId: CUSTOMER_ID,
            websiteId: REBILLY_WEBSITE_ID,
            items: [
                {
                    plan: 'online-course',
                    quantity: 1,
                }
            ],
            expand: 'recentInvoice'
        });

        return {
            statusCode: 303,
            location: order._embedded.recentInvoice.paymentFormUrl
        };
    }  catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: e})
        };
    }
};