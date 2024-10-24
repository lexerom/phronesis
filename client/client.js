const customerId = "cus_01J75YWQJ1MB7RDY74WT324C14";
document.querySelector('#app #deposit-button').onclick = async function (e) {
    e.target.disabled = true;
    const urlParams = new URLSearchParams(window.location.search);
    const currency = urlParams.get('currency');

    if (!['USD', 'CAD'].includes(currency)) {
        return;
    }

    const response = await fetch(
        "/.netlify/functions/deposit-12", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId, currency }),
        }
    );

    const {token, depositRequestId} = await response.json();

    RebillyInstruments.mount({
        apiMode: "sandbox",
        deposit: {
            depositRequestId,
        },
        jwt: token,
        theme: {
            colorBackground: '#f5f5f5',
        },
    });
}