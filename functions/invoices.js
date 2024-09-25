const RebillyAPI = require("rebilly-js-sdk").default;
require("dotenv").config();

const REBILLY_API_SECRET_KEY = process.env.API_KEY;
const REBILLY_ORGANIZATION_ID = process.env.ORG_ID;
const CUSTOMER_ID = "cus_01J75YWQJ1MB7RDY74WT324C14";
const rebilly = RebillyAPI({
    sandbox: process.env.ENV === "sandbox",
    apiKey: REBILLY_API_SECRET_KEY,
    organizationId: REBILLY_ORGANIZATION_ID,
});

exports.handler = async function (event, context) {
    try {
        const invoices = await rebilly.invoices.getAll({
            filter: `customerId:${CUSTOMER_ID}`,
        });

        return {
            statusCode: 200,
            body: JSON.stringify(invoices.items.map(({ fields }) => fields))
        };
    }  catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: e})
        };
    }
};