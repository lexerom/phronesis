const express = require("express");
const bodyParser = require("body-parser");
const RebillyAPI = require("rebilly-js-sdk").default;
require("dotenv").config();
const app = express();
const port = 3000;
app.use(express.static("client"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const REBILLY_API_SECRET_KEY = process.env.API_KEY;
const REBILLY_WEBSITE_ID = process.env.WEBSITE_ID;
const REBILLY_ORGANIZATION_ID = process.env.ORG_ID;
const CUSTOMER_ID = 'cus_01J75YWQJ1MB7RDY74WT324C14';
const rebilly = RebillyAPI({
    sandbox: process.env.ENV === 'sandbox',
    apiKey: REBILLY_API_SECRET_KEY,
    organizationId: REBILLY_ORGANIZATION_ID,
});
app.get("/book", async (req, res) => {
    res.redirect(301, "/book.html");
});
app.post("/book", async function (req, res) {
    const { bookId } = req.body;
    const strategies = {
        'book-1': 'dep_str_01J7DQA49XFFKE9Q2Q01Z07DES',
        'book-2': 'dep_str_01J7DQ96RPEY51NTBHQEDH3XH0',
        'book-3': 'dep_str_01J7DM0GQYWS8PRKHQQHDF1WBC',
    };
    const response = {};
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
    const requestDepositData = {
        websiteId: REBILLY_WEBSITE_ID,
        customerId: CUSTOMER_ID,
        currency: "USD",
        strategyId: strategies[bookId],
    };
    const { fields: depositFields } = await rebilly.depositRequests.create({
        data: requestDepositData,
    });
    response.token = exchangeToken.token;
    response.depositRequestId = depositFields.id;
    res.send(response);
});
app.listen(port, () => {
    console.log(`Sandbox listening on port ${port}`);
});