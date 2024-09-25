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

exports.handler = async function(event, context) {
    const data = {
        mode: "passwordless",
        customerId: CUSTOMER_ID,
    };

    const { fields: login } = await rebilly.customerAuthentication.login({
        data,
    });

    const { fields: exchangeToken } =
        await rebilly.customerAuthentication.exchangeToken({
            token: login.token,
            data: {
                acl: [
                    {
                        scope: {
                            organizationId: [REBILLY_ORGANIZATION_ID],
                        },
                        permissions: [
                            "PostToken",
                            "PostDigitalWalletValidation",
                            "StorefrontGetAccount",
                            "StorefrontPatchAccount",
                            "StorefrontPostPayment",
                            "StorefrontGetTransaction",
                            "StorefrontGetPaymentInstrumentCollection",
                            "StorefrontPostPaymentInstrument",
                            "StorefrontGetPaymentInstrument",
                            "StorefrontPatchPaymentInstrument",
                            "StorefrontPostPaymentInstrumentDeactivation",
                            "StorefrontGetWebsite",
                            "StorefrontGetInvoiceCollection",
                            "StorefrontGetInvoice",
                            "StorefrontGetProductCollection",
                            "StorefrontGetProduct",
                            "StorefrontPostReadyToPay",
                            "StorefrontPostPreviewPurchase",
                        ],
                    },
                ],
                customClaims: {
                    websiteId: REBILLY_WEBSITE_ID,
                },
            },
        });

    return {
        statusCode: 200,
        body: JSON.stringify({ token: exchangeToken.token }),
    };
};