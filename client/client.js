const customerId = "cus_01J75YWQJ1MB7RDY74WT324C14";
document.querySelector('main #deposit-button').onclick = async function () {
    const response = await fetch(
        "/.netlify/functions/deposit-11", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId }),
        }
    );

    const {token, depositRequestId} = await response.json();

    RebillyInstuments.mount({
        apiMode: "sandbox",
        deposit: {
            depositRequestId,
        },
        jwt: token,
    });
}