const steps = document.querySelectorAll(".step");
const stepIndicators = document.querySelectorAll(".step-item");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const payBtn = document.getElementById("payBtn");
const form = document.getElementById("checkoutForm");
const messageBox = document.getElementById("messageBox");

const previewCard = document.getElementById("previewCard");

let currentStep = 1;

const fieldsByStep = {
  1: ["fullName", "email", "phone"],
  2: ["address", "city", "zip", "country"],
  3: ["cardName", "cardNumber", "expiry", "cvv"]
};

function showStep(stepNumber) {
  steps.forEach(step => {
    step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
  });

  stepIndicators.forEach(indicator => {
    const indicatorNumber = Number(indicator.dataset.indicator);

    indicator.classList.toggle("active", indicatorNumber === stepNumber);
    indicator.classList.toggle("completed", indicatorNumber < stepNumber);
  });

  prevBtn.classList.toggle("d-none", stepNumber === 1 || stepNumber === 5);
  nextBtn.classList.toggle("d-none", stepNumber === 4 || stepNumber === 5);
  payBtn.classList.toggle("d-none", stepNumber !== 4);

  messageBox.innerHTML = "";

  if (stepNumber === 4) {
    fillReviewInfo();
  }

  if (stepNumber === 5) {
    document.querySelector(".summary-panel").style.display = "none";
  } else {
    document.querySelector(".summary-panel").style.display = "block";
  }
}

function setError(input, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  input.parentElement.querySelector(".error").textContent = message;
}

function setSuccess(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  input.parentElement.querySelector(".error").textContent = "";
}

function validateField(id) {
  const input = document.getElementById(id);
  const value = input.value.trim();

  if (value === "") {
    setError(input, "This field is required.");
    return false;
  }

  if (id === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      setError(input, "Please enter a valid email address.");
      return false;
    }
  }

  if (id === "phone") {
    const phonePattern = /^[0-9+\s-]{7,15}$/;

    if (!phonePattern.test(value)) {
      setError(input, "Please enter a valid phone number.");
      return false;
    }
  }

  if (id === "cardNumber") {
    const cardPattern = /^[0-9\s]{16,19}$/;

    if (!cardPattern.test(value)) {
      setError(input, "Please enter a valid card number.");
      return false;
    }
  }

  if (id === "expiry") {
    const expiryPattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

    if (!expiryPattern.test(value)) {
      setError(input, "Use MM/YY format.");
      return false;
    }
  }

  if (id === "cvv") {
    const cvvPattern = /^[0-9]{3,4}$/;

    if (!cvvPattern.test(value)) {
      setError(input, "CVV must be 3 or 4 digits.");
      return false;
    }
  }

  setSuccess(input);
  return true;
}

function validateStep(stepNumber) {
  const fields = fieldsByStep[stepNumber];

  if (!fields) return true;

  let stepIsValid = true;

  fields.forEach(id => {
    if (!validateField(id)) {
      stepIsValid = false;
    }
  });

  return stepIsValid;
}

function fillReviewInfo() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const country = document.getElementById("country").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");

  document.getElementById("reviewName").textContent = fullName;
  document.getElementById("reviewEmail").textContent = email;
  document.getElementById("reviewAddress").textContent = `${address}, ${city}, ${country}`;
  document.getElementById("reviewCard").textContent = `•••• •••• •••• ${cardNumber.slice(-4)}`;
}

function generateOrderNumber() {
  return "ORD-" + Math.floor(10000 + Math.random() * 90000);
}

nextBtn.addEventListener("click", () => {
  if (validateStep(currentStep)) {
    currentStep++;
    showStep(currentStep);
  }
});

prevBtn.addEventListener("click", () => {
  currentStep--;
  showStep(currentStep);
});

form.addEventListener("submit", event => {
  event.preventDefault();

  payBtn.disabled = true;
  payBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2"></span>
    Processing...
  `;

  messageBox.innerHTML = "";

  setTimeout(() => {
    const paymentSuccess = Math.random() > 0.25;

    if (paymentSuccess) {
      document.getElementById("orderNumber").textContent = generateOrderNumber();
      document.getElementById("successEmail").textContent =
        document.getElementById("email").value.trim();

      payBtn.disabled = false;
      payBtn.innerHTML = "Pay $84.00";

      currentStep = 5;
      showStep(currentStep);
    } else {
      messageBox.innerHTML = `
        <div class="alert alert-danger">
          Payment failed. Please check your payment details or try again.
        </div>
      `;

      payBtn.disabled = false;
      payBtn.innerHTML = "Pay $84.00";
    }
  }, 1500);
});

document.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) {
      validateField(input.id);
    }
  });
});

document.getElementById("cardNumber").addEventListener("input", event => {
  let value = event.target.value.replace(/\D/g, "");
  value = value.substring(0, 16);
  value = value.replace(/(.{4})/g, "$1 ").trim();

  event.target.value = value;

  const cleanValue = value.replace(/\s/g, "");

  previewCard.textContent = cleanValue.length >= 4
    ? `•••• •••• •••• ${cleanValue.slice(-4)}`
    : "•••• •••• •••• 3456";
});

document.getElementById("expiry").addEventListener("input", event => {
  let value = event.target.value.replace(/\D/g, "");
  value = value.substring(0, 4);

  if (value.length >= 3) {
    value = `${value.substring(0, 2)}/${value.substring(2)}`;
  }

  event.target.value = value;
});

showStep(currentStep);