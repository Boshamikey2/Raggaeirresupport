// Media Gallery Component
class MediaGallery {
  constructor(containerId, items) {
    this.container = document.getElementById(containerId)
    this.items = items
    this.currentIndex = 0
    this.init()
  }

  init() {
    this.render()
    this.bindEvents()
  }

  render() {
    if (!this.container) {
      console.error("Media gallery container not found:", this.containerId)
      return
    }

    const galleryHTML = this.items
      .map(
        (item, index) => `
          <div class="media-item ${item.type}" data-index="${index}" onclick="openMediaModal(${index})">
              <img src="${item.thumbnail || item.src}" alt="${item.title}" loading="lazy">
              ${
                item.type === "video"
                  ? `
                  <div class="media-overlay">
                      <div class="play-button">
                          <i class="fas fa-play"></i>
                      </div>
                  </div>
              `
                  : ""
              }
              <div class="media-title">${item.title}</div>
          </div>
      `,
      )
      .join("")

    this.container.innerHTML = galleryHTML
  }

  openModal(index) {
    this.currentIndex = index
    const modal = document.getElementById("mediaModal")
    const item = this.items[index]

    this.updateModalContent(item)
    modal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent body scrolling when modal is open
  }

  closeModal() {
    const modal = document.getElementById("mediaModal")
    modal.classList.remove("active")
    document.body.style.overflow = "" // Restore body scrolling
    // Stop any playing video when closing the modal
    const currentVideo = document.querySelector("#mediaContent video")
    if (currentVideo) {
      currentVideo.pause()
      currentVideo.currentTime = 0
    }
  }

  updateModalContent(item) {
    const mediaContent = document.getElementById("mediaContent")
    const mediaInfo = document.getElementById("mediaInfo")

    if (item.type === "video") {
      // For local videos, use a <video> tag
      mediaContent.innerHTML = `
              <video controls autoplay loop style="width: 100%; max-height: 70vh;">
                  <source src="${item.src}" type="video/mp4">
                  Your browser does not support the video tag.
              </video>
          `
    } else {
      // For images, use an <img> tag
      mediaContent.innerHTML = `
              <img src="${item.src}" alt="${item.title}">
          `
    }

    mediaInfo.innerHTML = `
          <h4>${item.title}</h4>
          <p>${item.description || ""}</p>
      `
  }

  previousMedia() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length
    this.updateModalContent(this.items[this.currentIndex])
  }

  nextMedia() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length
    this.updateModalContent(this.items[this.currentIndex])
  }

  bindEvents() {
    // Keyboard navigation: Escape to close, ArrowLeft/Right for navigation
    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById("mediaModal")
      if (modal && modal.classList.contains("active")) {
        if (e.key === "Escape") {
          this.closeModal()
        } else if (e.key === "ArrowLeft") {
          this.previousMedia()
        } else if (e.key === "ArrowRight") {
          this.nextMedia()
        }
      }
    })

    // Close modal when clicking on the overlay (outside the content)
    const mediaModal = document.getElementById("mediaModal")
    if (mediaModal) {
      mediaModal.addEventListener("click", (e) => {
        if (e.target.id === "mediaModal") {
          this.closeModal()
        }
      })
    }
  }
}

// Donation Modal Component
class DonationModal {
  constructor() {
    this.currentStep = "amount"
    this.selectedAmount = 0
    this.selectedPaymentMethod = ""
    this.init()
  }

  init() {
    this.bindEvents()
  }

  open() {
    const modal = document.getElementById("donationModal")
    if (modal) {
      modal.classList.add("active")
      document.body.style.overflow = "hidden"
      this.showStep("amount")
    }
  }

  close() {
    const modal = document.getElementById("donationModal")
    if (modal) {
      modal.classList.remove("active")
      document.body.style.overflow = ""
      this.reset()
    }
  }

  reset() {
    this.currentStep = "amount"
    this.selectedAmount = 0
    this.selectedPaymentMethod = ""
    const customAmount = document.getElementById("customAmount")
    const donationForm = document.getElementById("donationForm")
    if (customAmount) customAmount.value = ""
    if (donationForm) donationForm.reset()
    this.clearAmountSelection()
    this.clearPaymentSelection()
    // Remove any existing messages
    const existingMessage = document.querySelector("#donationModal .message")
    if (existingMessage) {
      existingMessage.remove()
    }
  }

  showStep(step) {
    // Hide all steps
    document.querySelectorAll(".donation-step").forEach((el) => {
      el.classList.add("hidden")
    })

    // Show current step
    const stepElement = document.getElementById(step + "Step")
    if (stepElement) {
      stepElement.classList.remove("hidden")
    }
    this.currentStep = step
  }

  selectAmount(amount) {
    this.selectedAmount = amount
    const customAmount = document.getElementById("customAmount")
    if (customAmount) customAmount.value = "" // Clear custom amount if a button is selected
    this.updateAmountButtons()
  }

  updateAmountButtons() {
    document.querySelectorAll(".amount-btn").forEach((btn) => {
      btn.classList.remove("selected")
    })

    if (this.selectedAmount > 0) {
      const selectedBtn = Array.from(document.querySelectorAll(".amount-btn")).find((btn) =>
        btn.textContent.includes(this.selectedAmount.toLocaleString()),
      )
      if (selectedBtn) {
        selectedBtn.classList.add("selected")
      }
    }
  }

  clearAmountSelection() {
    document.querySelectorAll(".amount-btn").forEach((btn) => {
      btn.classList.remove("selected")
    })
  }

  proceedToPayment() {
    const customAmountInput = document.getElementById("customAmount")
    if (customAmountInput && customAmountInput.value) {
      this.selectedAmount = Number.parseInt(customAmountInput.value) || 0
    }

    if (this.selectedAmount <= 0) {
      this.showMessage("Please select or enter a donation amount.", "error")
      return
    }

    const selectedAmountDisplay = document.getElementById("selectedAmountDisplay")
    if (selectedAmountDisplay) {
      selectedAmountDisplay.textContent = `Donating KES ${this.selectedAmount.toLocaleString()}`
    }
    this.showStep("payment")
  }

  goBackToAmount() {
    this.showStep("amount")
  }

  selectPaymentMethod(method) {
    this.selectedPaymentMethod = method
    document.querySelectorAll(".payment-method").forEach((el) => {
      el.classList.remove("selected")
    })

    const methodElement = document.querySelector(`[onclick="selectPaymentMethod('${method}')"]`)
    if (methodElement) {
      methodElement.classList.add("selected")
    }

    const radioElement = document.getElementById(method)
    if (radioElement) {
      radioElement.checked = true
    }
  }

  clearPaymentSelection() {
    document.querySelectorAll(".payment-method").forEach((el) => {
      el.classList.remove("selected")
    })
    document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
      input.checked = false
    })
  }

  proceedToDetails() {
    if (!this.selectedPaymentMethod) {
      this.showMessage("Please select a payment method.", "error")
      return
    }

    if (this.selectedPaymentMethod === "bank") {
      this.showBankInfo()
      return
    }

    const paymentSummary = document.getElementById("paymentSummary")
    if (paymentSummary) {
      paymentSummary.textContent = `KES ${this.selectedAmount.toLocaleString()} via ${this.selectedPaymentMethod}`
    }

    // Show/hide phone field specifically for M-Pesa
    const phoneGroup = document.getElementById("phoneGroup")
    const donorPhone = document.getElementById("donorPhone")
    if (this.selectedPaymentMethod === "mpesa") {
      if (phoneGroup) phoneGroup.style.display = "block"
      if (donorPhone) donorPhone.required = true
    } else {
      if (phoneGroup) phoneGroup.style.display = "none"
      if (donorPhone) donorPhone.required = false
    }

    this.showStep("details")
  }

  goBackToPayment() {
    this.showStep("payment")
  }

  showBankInfo() {
    const modal = document.getElementById("bankInfoModal")
    if (modal) {
      modal.classList.add("active")
    }
  }

  submitDonation(formData) {
    // Display a processing message
    this.showMessage("Processing your donation...", "info")

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you'd check the API response for success/failure
      const isSuccess = true // Assume success for demonstration

      if (isSuccess) {
        this.showMessage(
          `Thank you for your KES ${this.selectedAmount.toLocaleString()} donation via ${this.selectedPaymentMethod}!`,
          "success",
        )
        // Close modal after a short delay on success
        setTimeout(() => {
          this.close()
        }, 3000)
      } else {
        this.showMessage("There was an error processing your donation. Please try again.", "error")
      }
    }, 2000) // Simulate 2-second processing time
  }

  showMessage(text, type) {
    // Remove any existing messages to prevent stacking
    const existingMessage = document.querySelector("#donationModal .message")
    if (existingMessage) {
      existingMessage.remove()
    }

    // Create new message element
    const message = document.createElement("div")
    message.className = `message ${type}`
    message.innerHTML = `
            <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
            ${text}
        `

    // Insert message at the beginning of the modal body
    const modalBody = document.querySelector("#donationModal .modal-body")
    if (modalBody) {
      modalBody.insertBefore(message, modalBody.firstChild)
    }

    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (message.parentNode) {
        // Check if message is still in DOM before removing
        message.remove()
      }
    }, 5000)
  }

  bindEvents() {
    // Event listener for custom amount input field
    const customAmount = document.getElementById("customAmount")
    if (customAmount) {
      customAmount.addEventListener("input", (e) => {
        if (e.target.value) {
          this.selectedAmount = Number.parseInt(e.target.value) || 0
          this.clearAmountSelection() // Clear predefined button selection if custom amount is entered
        }
      })
    }

    // Event listener for donation form submission
    const donationForm = document.getElementById("donationForm")
    if (donationForm) {
      donationForm.addEventListener("submit", (e) => {
        e.preventDefault() // Prevent default form submission
        const formData = new FormData(e.target)
        this.submitDonation(formData)
      })
    }

    // Close modal when clicking on the overlay
    const donationModal = document.getElementById("donationModal")
    if (donationModal) {
      donationModal.addEventListener("click", (e) => {
        if (e.target.id === "donationModal") {
          this.close()
        }
      })
    }

    // Close modal on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const donationModal = document.getElementById("donationModal")
        if (donationModal && donationModal.classList.contains("active")) {
          this.close()
        }
      }
    })
  }
}

// Volunteer Modal Component
class VolunteerModal {
  constructor() {
    this.init()
  }

  init() {
    this.bindEvents()
  }

  open() {
    const modal = document.getElementById("volunteerModal")
    if (modal) {
      modal.classList.add("active")
      document.body.style.overflow = "hidden"
    }
  }

  close() {
    const modal = document.getElementById("volunteerModal")
    if (modal) {
      modal.classList.remove("active")
      document.body.style.overflow = ""
    }
    const volunteerForm = document.getElementById("volunteerForm")
    if (volunteerForm) {
      volunteerForm.reset() // Clear form fields
    }
    // Remove any existing messages
    const existingMessage = document.querySelector("#volunteerModal .message")
    if (existingMessage) {
      existingMessage.remove()
    }
  }

  submitApplication(formData) {
    this.showMessage("Submitting your application...", "info")

    // Simulate API call delay
    setTimeout(() => {
      const isSuccess = true // Assume success for demonstration

      if (isSuccess) {
        this.showMessage(
          "Thank you! Your volunteer application has been submitted successfully. We'll review your application and get back to you soon.",
          "success",
        )
        // Close modal after a short delay on success
        setTimeout(() => {
          this.close()
        }, 4000)
      } else {
        this.showMessage("There was an error submitting your volunteer application. Please try again.", "error")
      }
    }, 2000) // Simulate 2-second processing time
  }

  showMessage(text, type) {
    // Remove any existing messages to prevent stacking
    const existingMessage = document.querySelector("#volunteerModal .message")
    if (existingMessage) {
      existingMessage.remove()
    }

    // Create new message element
    const message = document.createElement("div")
    message.className = `message ${type}`
    message.innerHTML = `
            <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
            ${text}
        `

    // Insert message at the beginning of the modal body
    const modalBody = document.querySelector("#volunteerModal .modal-body")
    if (modalBody) {
      modalBody.insertBefore(message, modalBody.firstChild)
    }

    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.remove()
      }
    }, 5000)
  }

  bindEvents() {
    // Event listener for volunteer form submission
    const volunteerForm = document.getElementById("volunteerForm")
    if (volunteerForm) {
      volunteerForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        this.submitApplication(formData)
      })
    }

    // Close modal when clicking on the overlay
    const volunteerModal = document.getElementById("volunteerModal")
    if (volunteerModal) {
      volunteerModal.addEventListener("click", (e) => {
        if (e.target.id === "volunteerModal") {
          this.close()
        }
      })
    }

    // Close modal on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const volunteerModal = document.getElementById("volunteerModal")
        if (volunteerModal && volunteerModal.classList.contains("active")) {
          this.close()
        }
      }
    })
  }
}

// Utility Functions
function copyToClipboard(text) {
  if (navigator.clipboard) {
    // Use modern Clipboard API if available
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(window.messages.copy.success, "success")
      })
      .catch(() => {
        showToast(window.messages.copy.error, "error")
      })
  } else {
    // Fallback for older browsers: create a temporary textarea
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand("copy")
      showToast(window.messages.copy.success, "success")
    } catch (err) {
      showToast(window.messages.copy.error, "error")
    }
    document.body.removeChild(textArea)
  }
}

function showToast(message, type) {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
    ${message}
  `

  // Add toast styles dynamically if not already present in the DOM
  if (!document.querySelector(".toast-styles")) {
    const style = document.createElement("style")
    style.className = "toast-styles"
    style.textContent = `
      .toast {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 3000; /* Ensure toast is above everything */
        transform: translateX(100%); /* Start off-screen */
        transition: transform 0.3s ease;
      }
      .toast.toast-success { border-left: 4px solid #10b981; color: #065f46; }
      .toast.toast-error { border-left: 4px solid #ef4444; color: #991b1b; }
      .toast.show { transform: translateX(0); } /* Slide into view */
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(toast)

  // Trigger the slide-in animation
  setTimeout(() => toast.classList.add("show"), 100)

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show") // Trigger slide-out animation
    setTimeout(() => {
      if (document.body.contains(toast)) {
        // Check if still in DOM before removing
        document.body.removeChild(toast)
      }
    }, 300) // Allow time for slide-out animation to complete
  }, 3000)
}

// Initialize components
let mediaGallery, donationModal, volunteerModal

document.addEventListener("DOMContentLoaded", () => {
  // Ensure mediaGalleryData is defined before initializing MediaGallery
  // This assumes mediaGalleryData is loaded from js/data.js before js/components.js
  const mediaGalleryData = window.mediaGalleryData // Declare mediaGalleryData here
  if (typeof mediaGalleryData !== "undefined") {
    mediaGallery = new MediaGallery("mediaGallery", mediaGalleryData)
    window.mediaGallery = mediaGallery // Make accessible globally
  } else {
    console.error("mediaGalleryData is not defined. Ensure js/data.js is loaded before js/components.js")
  }
  donationModal = new DonationModal()
  volunteerModal = new VolunteerModal()
  window.donationModal = donationModal // Make accessible globally
  window.volunteerModal = volunteerModal // Make accessible globally
})
