document.querySelector('main #deposit-button').onsubmit = async function () {
    const deposit = await fetch("/.netlify/functions/deposit-11").then((res) => res.json());
}