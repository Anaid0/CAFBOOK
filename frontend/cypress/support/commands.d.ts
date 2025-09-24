/// <reference types="cypress" />

export {}; // convierte el archivo en un módulo para permitir augmentations

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command para hacer login por UI
       * @param email string
       * @param password string
       */
      loginUI(email: string, password: string): Chainable<void>;
    }
  }
}