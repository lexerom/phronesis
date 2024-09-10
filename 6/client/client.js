const bookButtons = document.querySelectorAll('[data-id]');

for (let button of bookButtons) {
    button.addEventListener('click', (e) => makeBooking(e.target.dataset.id));
}

const makeBooking = async (id) => {
    document.querySelector('.rebilly-instruments-summary').innerHTML = '';
    document.querySelector('.rebilly-instruments').innerHTML = '';

    const response = await fetch("/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ bookId: id }),
    });
    const { token, depositRequestId } = await response.json();
    // Mount Rebilly Instruments
    RebillyInstruments.mount({
        apiMode: "sandbox",
        deposit: {
            depositRequestId,
        },
        jwt: token,
    });
    // Optional
    RebillyInstruments.on("instrument-ready", (instrument) => {
        console.info("instrument-ready", instrument);
    });

    RebillyInstruments.on("purchase-completed", (purchase) => {
        console.info("purchase-completed", purchase);
    });
};
