Framepay.initialize({
    publishableKey: 'pk_sandbox_5tKTVcM5uEcuYwvjgpMFjstxwuoxHwByheBApnN',
    organizationId: 'phronesis-oceanic-getaway',
    websiteId: 'pronesis-oceanic-getaway.com',
    transactionData: {
        currency: 'USD',
        amount: 997,
    },
});
Framepay.on('ready', function () {
    const card = Framepay.card.mount('#mounting-point');
});
const form = document.querySelector("#payment-form");
const btnSubmit = document.querySelector("#payment-form button")
form.onsubmit = async function (e) {
    e.preventDefault();
    e.stopPropagation();
    try {
        btnSubmit.disabled = true;
        const {id: paymentToken, billingAddress} = await Framepay.createToken(form);
        // Use this paymentToken in your subsequent Rebilly API calls to complete your checkout process
        console.log(paymentToken);

        const purchase = {
            paymentToken,
            billingAddress,
            currency: 'USD',
            amount: 997,
        };

        const response = await fetch('/.netlify/functions/create-transaction', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(purchase),
        });

        const transaction = (await response.json()).transaction;
        const approvalUrl = transaction?._links.find(({rel}) => rel === "approvalUrl");
        if (approvalUrl) {
            window.location = approvalUrl.href;
        } else {
            window.location.reload();
        }
    } catch (error) {
        console.log('❌ Create token error:', error);
    } finally {
        btnSubmit.disabled = false;
    }
};
