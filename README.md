# 🧪 Comprehensive End-to-End Automation Framework | Cypress

This repository features a high-level, production-grade automation framework built with **Cypress**. It is designed to perform robust End-to-End (E2E) testing on a live web application, ensuring reliability, speed, and high test coverage.

---

## 🌟 Key Highlights

* **🏗️ Page Object Model (POM):** Implemented for clean separation of test logic and UI locators, making the framework highly maintainable.
* **⚡ Flake-Resistant Tests:** Advanced use of dynamic waits and custom commands to handle real-world asynchronous behaviors.
* **🛡️ Built-in API Testing:** Integrated API calls to set up test data (Pre-conditions) and speed up execution flows.
* **📊 Comprehensive Reporting:** Visual execution logs with screenshots and video recordings of failed test cases.
* **🔄 CI/CD Integration:** Seamlessly integrated with GitHub Actions for automated regression testing on every push.

---

## 🏗 Framework Architecture

The framework is structured to support scalability and ease of use:

1.  **e2e/ (Test Suites):** Organized by feature sets (Login, Checkout, Profile, etc.).
2.  **support/pages/ (POM):** Encapsulated selectors and methods for each page of the live site.
3.  **fixtures/ (Test Data):** Externalized JSON data to enable data-driven testing.
4.  **support/commands.js:** Custom Cypress commands for reusable actions (e.g., `cy.login()`).



---

## 🛠 Tech Stack

* **Automation Tool:** Cypress.io
* **Language:** JavaScript (ES6+) / TypeScript
* **Design Pattern:** Page Object Model (POM)
* **Reporting:** Mochawesome / Cypress Dashboard
* **CI/CD:** GitHub Actions

---

## ✨ Features Covered

- [x] **Cross-Browser Testing:** Execution support for Chrome, Firefox, and Electron.
- [x] **Responsive Testing:** Viewport configuration for Mobile, Tablet, and Desktop resolutions.
- [x] **Security Testing:** Basic checks for unauthorized access and protected routes.
- [x] **Visual Testing:** Comparison of UI elements to ensure consistent design.
- [x] **Shadow DOM Support:** Handling complex web components within the live site.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+)
* npm / yarn

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/cypress-pro-automation.git](https://github.com/your-username/cypress-pro-automation.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running Tests
* **Open Cypress Test Runner (Interactive):**
  ```bash
  npx cypress open
