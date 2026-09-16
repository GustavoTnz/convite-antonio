/* ============================================================
   CONVITE — ANTÔNIO BENÍCIO
   Lógica dos modais (Local / Confirmar presença / Sobre) e do
   formulário de RSVP.
   ============================================================ */

// ------------------------------------------------------------------
// CONFIGURAÇÃO: como as confirmações de presença chegam até vocês.
// Este convite não tem servidor/banco de dados — então, ao confirmar,
// o próprio convidado abre o WhatsApp com uma mensagem pronta para
// enviar aos anfitriões.
// ------------------------------------------------------------------
const HOST_WHATSAPP_NUMBER = "5575992143663";

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

  // Fecha o modal aberto ao pressionar Esc
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openModalEl = document.querySelector(".modal.is-open");
    closeModal(openModalEl);
  });

  // ------------------ Formulário "Confirmar presença" ------------------
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpSuccess = document.getElementById("rsvp-success");
  const companionRadios = rsvpForm.querySelectorAll('input[name="companion"]');
  const companionCountField = document.getElementById("companion-count-field");
  const companionCountInput = document.getElementById("rsvp-companion-count");

  // O campo "Quantos acompanhantes?" só aparece quando a resposta é "Sim"
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
      return; // o "required" dos campos já orienta o convidado
    }

    // Mensagem final varia conforme a resposta de presença
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

    // Mostra a tela de sucesso dentro do próprio convite
    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
  });

  // Ao fechar o modal de RSVP, volta ao formulário para uma próxima visita
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
