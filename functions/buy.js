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

    Response.redirect(order._embedded.recentInvoice.paymentFormUrl, 303);
};