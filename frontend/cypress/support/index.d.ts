/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Login con UI usando email y password
     * @example cy.loginUI('user@mail.com', '123456')
     */
    loginUI(email: string, password: string): Chainable<void>;
  }
}