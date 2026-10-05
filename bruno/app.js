(() => {
  "use strict";

  // The address never appears as plain text in the source: it is stored
  // reversed and split, and only shown once a human interacts with the page.
  const MAILBOX = ["er.uaraoh", "onurb"];
  const email = () => MAILBOX.join(String.fromCharCode(64)).split("").reverse().join("");
  const $ = (id) => document.getElementById(id);

  const toast = $("toast");
  let toastTimer;
  const notify = (text) => {
    toast.textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2200);
  };

  // Clicking the facts link reveals the address; any copy button copies it.
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.classList.contains("reveal-email") && button.dataset.shown !== "1") {
        button.textContent = email();
        button.dataset.shown = "1";
        return;
      }
      try {
        await navigator.clipboard.writeText(email());
        notify("Adresse copiée");
      } catch {
        notify(email());
      }
    });
  });

  // The mailto link is only built at click time.
  $("cta").addEventListener("click", (event) => {
    event.preventDefault();
    location.href = `mailto:${email()}?subject=${encodeURIComponent("Prise de contact depuis bruno.hoarau.re")}`;
  });
})();
