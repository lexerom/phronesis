async function payForInvoice(invoiceId) {
  const { token: jwt } = await fetch("/.netlify/functions/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((resp) => resp.json());

  RebillyInstruments.mount({
    apiMode: "sandbox",
    invoiceId,
    jwt,
  });
}

async function init() {
  const invoices = await fetch("/.netlify/functions/invoices").then((res) => res.json());
  const invoicesContainer = document.querySelector(".invoice__container");
  for (const invoice of invoices) {
    const invoiceElement = document.createElement("tr");
    invoiceElement.classList.add("invoice");
    invoiceElement.innerHTML = `
      <td class="invoice__id">${invoice.id}</td>
      <td class="invoice__id">${invoice.issuedTime}</td>
      <td class="invoice__status">${invoice.status}</td>
      <td class="invoice__amount">${invoice.amountDue} ${invoice.currency}</td>
      <td class="invoice__actions">${
        invoice.amountDue > 0
          ? `<button class="invoice__pay" data-id="${invoice.id}">Pay</button>`
          : "–––"
      }</td>
    `;
    invoicesContainer.appendChild(invoiceElement);
  }
  document.querySelectorAll(".invoice__pay").forEach((button) => {
    button.addEventListener("click", (e) => payForInvoice(e.target.dataset.id));
  });
}

document.addEventListener("DOMContentLoaded", init);
