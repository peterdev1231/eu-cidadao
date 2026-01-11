(() => {
  const offer = document.querySelector("[data-offer]");
  const cta = document.querySelector("[data-offer-cta]");
  const status = document.querySelector("[data-offer-status]");
  if (!offer) return;

  const OFFER_DELAY_SECONDS = 17 * 60 + 12;
  let revealed = false;

  offer.hidden = true;
  if (cta) {
    cta.hidden = true;
  }

  const revealOffer = () => {
    if (revealed) return;
    revealed = true;
    offer.hidden = false;
    offer.classList.add("is-visible");
    if (cta) {
      cta.hidden = false;
    }
    if (status) {
      status.textContent = "Oferta liberada. Confira os detalhes abaixo.";
    }
  };

  setTimeout(revealOffer, OFFER_DELAY_SECONDS * 1000);
})();
