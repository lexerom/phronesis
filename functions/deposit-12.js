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

    const { customerId, currency } = JSON.parse(event.body);

    const data = {
        mode: "passwordless",
        customerId,
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
                            "StorefrontGetTransactionCollection",
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
                            "StorefrontGetPaymentInstrumentSetup",
                            "StorefrontPostPaymentInstrumentSetup",
                            "StorefrontGetDepositRequest",
                            "StorefrontGetDepositStrategy",
                            "StorefrontPostDeposit",
                        ],
                    },
                ],
                customClaims: {
                    websiteId: REBILLY_WEBSITE_ID,
                },
            },
        });

    try {
        const requestDepositData = {
            websiteId: REBILLY_WEBSITE_ID,
            customerId,
            currency,
        };
        const { fields: depositFields } = await rebilly.depositRequests.create({
            data: requestDepositData,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                depositRequestId: depositFields.id,
                token: exchangeToken.token,
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