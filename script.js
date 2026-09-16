const HOST_WHATSAPP_NUMBER = "557592740732";

document.addEventListener("DOMContentLoaded", () => {
  const modals = document.querySelectorAll(".modal");
  const openButtons = document.querySelectorAll("[data-modal]");
  const closeTriggers = document.querySelectorAll("[data-close]");

  let lastFocusedElement = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById(btn.dataset.modal);
      openModal(modal);
    });
  });

  closeTriggers.forEach((el) => {
    el.addEventListener("click", () => {
      const modal = el.closest(".modal");
      closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openModalEl = document.querySelector(".modal.is-open");
    closeModal(openModalEl);
  });

  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpSuccess = document.getElementById("rsvp-success");
  const companionRadios = rsvpForm.querySelectorAll('input[name="companion"]');
  const companionCountField = document.getElementById("companion-count-field");
  const companionCountInput = document.getElementById("rsvp-companion-count");

  companionRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const showCount = radio.value === "Sim" && radio.checked;
      companionCountField.classList.toggle("is-visible", showCount);
      if (!showCount) companionCountInput.value = "";
    });
  });

  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = document.getElementById("rsvp-firstname").value.trim();
    const attending = rsvpForm.querySelector('input[name="attending"]:checked');
    const companion = rsvpForm.querySelector('input[name="companion"]:checked');
    const companionCount = companionCountInput.value.trim();

    if (!firstName || !attending || !companion) {
      return;
    }

    let message;
    if (attending.value === "Sim") {
      message =
        `Olá! Meu nome é ${firstName} e estou confirmando minha presença ` +
        `no aniversário do Antônio Benício! Levando acompanhante: ${companion.value}` +
        (companion.value === "Sim" && companionCount ? ` - Quantidade: ${companionCount}` : "") +
        ".";
    } else {
      message =
        `Olá! Meu nome é ${firstName}. Infelizmente não poderei comparecer ` +
        `ao aniversário do Antônio Benício, mas desejo uma ótima festa!`;
    }

    const whatsappUrl = `https://wa.me/${HOST_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
  });

  document.getElementById("modal-rsvp").addEventListener("transitionend", (event) => {
    const modal = event.currentTarget;
    if (!modal.classList.contains("is-open")) {
      rsvpForm.reset();
      rsvpForm.hidden = false;
      rsvpSuccess.hidden = true;
      companionCountField.classList.remove("is-visible");
    }
  });
});
