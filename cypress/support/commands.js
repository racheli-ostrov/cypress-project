// ***********************************************
// Custom Cypress commands
// ***********************************************

// Example custom command for login (if needed in the future)
// Cypress.Commands.add('login', (email, password) => {
//   cy.visit('/login');
//   cy.get('input[name="email"]').type(email);
//   cy.get('input[name="password"]').type(password);
//   cy.get('button[type="submit"]').click();
// });

// Custom command for taking screenshots with Hebrew names
Cypress.Commands.add('screenshotHebrew', (name) => {
  const timestamp = new Date().getTime();
  cy.screenshot(`${timestamp}-${name}`);
});

// Custom command for waiting and logging
Cypress.Commands.add('waitAndLog', (ms, message) => {
  if (message) {
    cy.log(message);
  }
  cy.wait(ms);
});
