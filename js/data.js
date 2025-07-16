/*
 * data.js
 *
 * This file contains all the static data used across the website,
 * such as media gallery items, donation options, contact information,
 * and validation rules. Centralizing data here makes it easy to update
 * content without modifying the core logic or structure.
 */

// Media Gallery Data: Defines items for the photo and video gallery.
// Each item has an ID, type (image/video), source (src), title, and description.
// Video items also have a thumbnail for display in the gallery grid.
const mediaGalleryData = [
  {
    id: 1,
    type: "image",
    src: "images/classroom-learning.jpg",
    title: "Children Learning Together",
    description: "Students engaged in classroom activities, showing the power of education in transforming lives.",
  },
  {
    id: 2,
    type: "image",
    src: "images/Patron-students.jpg",
    title: "Facilitator with Students",
    description: "Our organization facilitator working directly with children in the classroom.",
  },
  {
    id: 3,
    type: "video",
    src: "videos/student-success-story.mp4", // Local video file path
    thumbnail: "images/testimonial-student-1.jpg", // Thumbnail for gallery display
    title: "Student Success Story",
    description: "Khamati Elvina shares her journey and how the foundation changed her life.",
  },
  {
    id: 4,
    type: "image",
    src: "images/children-lineup.jpg",
    title: "School Children",
    description: "Children lined up at school, some with shoes, others without, but all sharing the same dreams.",
  },
  {
    id: 5,
    type: "video",
    src: "videos/ryan-testimonial.mp4", // Local video file path
    thumbnail: "images/testimonial-student-2.jpg",
    title: "Ryan's Testimonial",
    description: "Khamati Ryan talks about how educational support has given him hope for the future.",
  },
  {
    id: 6,
    type: "image",
    src: "images/School-washroom.jpg",
    title: "School Facilities",
    description: "The current state of school facilities, highlighting the need for infrastructure improvements.",
  },
  {
    id: 7,
    type: "video",
    src: "videos/siblings-journey.mp4", // Local video file path
    thumbnail: "images/testimonial-students-3.jpg",
    title: "Siblings' Journey",
    description: "Elvina and Ryan, studying together and supporting each other through their educational journey.",
  },
  {
    id: 8,
    type: "image",
    src: "images/school-urinary.jpg",
    title: "Infrastructure Challenges",
    description: "Current school infrastructure showing the urgent need for improvements and support.",
  },
]

// Donation amounts and payment methods: Configures options for the donation modal.
const donationData = {
  amounts: [500, 1000, 2500, 5000, 10000], // Predefined donation amounts in KES
  paymentMethods: {
    mpesa: {
      name: "M-Pesa",
      description: "Pay via M-Pesa mobile money",
      icon: "fas fa-mobile-alt",
      color: "#008000",
    },
    paypal: {
      name: "PayPal",
      description: "Pay with PayPal or credit card",
      icon: "fas fa-credit-card",
      color: "#003087",
    },
    bank: {
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: "fas fa-university",
      color: "#ff7e00",
    },
  },
}

// Bank transfer information: Details for direct bank donations.
const bankInfo = {
  bankName: "Kenya Commercial Bank (KCB)",
  accountName: "Raggaeirre Support Foundation",
  accountNumber: "1234567890",
  swiftCode: "KCBLKENX",
  branch: "Machakos Branch",
}

// Contact information: Details for reaching the foundation.
const contactInfo = {
  emails: ["info@raggaeirresupport.org", "nasiombeliz@gmail.com"],
  phones: ["+254 735 967 950", "+254 720 215 589"],
  address: "Machakos, County, 2805-90100",
}

// Statistics data: Numbers highlighting the foundation's impact.
const statsData = {
  studentsSupported: 50,
  activePrograms: 15,
  communitiesReached: 8,
  successRate: 95,
}

// Navigation links: Defines the main navigation menu items.
const navigationLinks = [
  { href: "#home", text: "Home" },
  { href: "#about", text: "About" },
  { href: "#programs", text: "Programs" },
  { href: "#testimonials", text: "Testimonials" },
  { href: "#stories", text: "Stories" },
  { href: "#contact", text: "Contact" },
]

// Success messages: Predefined messages for user feedback.
const messages = {
  donation: {
    success: "Thank you for your generous donation! Your support will make a real difference in children's lives.",
    error: "There was an error processing your donation. Please try again or contact us for assistance.",
  },
  volunteer: {
    success: "Thank you for your interest in volunteering! We will review your application and get back to you soon.",
    error: "There was an error submitting your volunteer application. Please try again.",
  },
  copy: {
    success: "Copied to clipboard!",
    error: "Failed to copy to clipboard.",
  },
}

// Form validation rules: Regular expressions for input validation.
const validationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Standard email regex
  phone: /^(\+254|254|0)?[17]\d{8}$/, // Kenyan phone number regex (simplified)
  amount: /^\d+(\.\d{1,2})?$/, // Positive number, optional two decimal places
}

// Expose data globally for access by other scripts (e.g., components.js, main.js)
// This is a common pattern in pure JS projects to share data between script files.
window.mediaGalleryData = mediaGalleryData
window.donationData = donationData
window.bankInfo = bankInfo
window.contactInfo = contactInfo
window.statsData = statsData
window.navigationLinks = navigationLinks
window.messages = messages
window.validationRules = validationRules
