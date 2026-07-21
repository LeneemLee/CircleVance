const header = document.querySelector("[data-header]");
const inquiryForm = document.querySelector("[data-inquiry-form]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(inquiryForm);
    const recipient = inquiryForm.dataset.recipient;
    const name = data.get("name") || "";
    const company = data.get("company") || "";
    const email = data.get("email") || "";
    const interest = data.get("interest") || "";
    const message = data.get("message") || "";
    const note = inquiryForm.querySelector("[data-form-note]");

    const subject = `Website inquiry from ${company || name || "CycleVance visitor"}`;
    const body = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Interest: ${interest}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (note) {
      note.textContent = "Opening your email app. If nothing opens, email info@CycleVance.com directly.";
    }

    window.location.href = mailtoUrl;
  });
}
