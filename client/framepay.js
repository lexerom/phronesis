Framepay.initialize({
    publishableKey: 'pk_sandbox_5tKTVcM5uEcuYwvjgpMFjstxwuoxHwByheBApnN',
    organizationId: '/phronesis-oceanic-getaway',
    websiteId: 'pronesis-oceanic-getaway.com',
    transactionData: {
        currency: 'USD',
        amount: 997,
    },
});
Framepay.on('ready', function () {
    const card = Framepay.card.mount('#mounting-point');
});
try {
    const form = document.getElementById('payment-form');
    const paymentToken = await Framepay.createToken(form);
    console.log(paymentToken);
} catch(error){
    console.log('❌ Create token error:', error);
}