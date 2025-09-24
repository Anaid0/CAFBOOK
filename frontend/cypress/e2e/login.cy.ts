describe("Flujos de Login en NodoVerde", () => {
  let users: any

  before(() => {
    cy.fixture("users").then((data) => {
      users = data
    })
  })

 beforeEach(() => {
  cy.visit('/screens/LoginScreen');
});


  it("Login con credenciales válidas", () => {
    cy.get("#login-email").type(users.validUser.email)
    cy.get("#login-password").type(users.validUser.password)
    cy.get("#login-submit").click()

    cy.url().should("not.include", "/login")
  })

  it("Mostrar error al intentar login con campos vacíos", () => {
    cy.get('[data-cy="login-submit"]').click()

    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("Debes ingresar correo y contraseña")
    })
  })

  it("Navegar a la pantalla de registro", () => {
    cy.get('[data-cy="login-switch-register"]').click()
  })
})