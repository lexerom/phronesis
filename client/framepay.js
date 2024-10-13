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
const btnSubmit = document.querySelector("#payment-form button");
const replays = document.querySelector('#payment-form #live-replays');
const partners = document.querySelector('#payment-form #partners');
const numberOfPartners = document.querySelector('#payment-form #number-partners');

function calculateTotal() {
    let total = 997;

    if (replays.checked) {
        total += 97;
    }

    if (partners.checked) {
        total += 697 * numberOfPartners.value;
    }

    return total;
}

replays.onchange = () => document.querySelector('#payment-form #total').innerHTML = calculateTotal().toString();
partners.onchange = function (e) {
    if (e.target.checked) {
        document.querySelector('#payment-form #partners-info').className = '';
    } else {
        document.querySelector('#payment-form #partners-info').className = 'hidden';
    }
    showPartners();
}

const showPartners = function(e) {
    const partners = document.querySelectorAll('#payment-form .partner');
    partners.forEach((partner) => partner.className = 'partner hidden');
    for (let i = 1; i <= numberOfPartners.value; i++) {
        document.querySelector('#payment-form #partner-' + i.toString()).className = 'partner';
    }

    document.querySelector('#payment-form #total').innerHTML = calculateTotal().toString();
}

numberOfPartners.onchange = () => showPartners();

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
            amount: calculateTotal(),
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
            window.location = '/thank-you.html';
        }
    } catch (error) {
        console.log('❌ Create token error:', error);
    } finally {
        btnSubmit.disabled = false;
    }
};
