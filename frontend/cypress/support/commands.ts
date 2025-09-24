Cypress.Commands.add("loginUI", (email: string, password: string) => {
  cy.get('[data-cy="email"]').clear().type(email);
  cy.get('[data-cy="password"]').clear().type(password);
  cy.get('[data-cy="login-button"]').click();
});