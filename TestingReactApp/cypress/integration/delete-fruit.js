describe('Visit the client and delete fruit', () => {

  it('Visits the client', () => {
    cy.visit('http://localhost:3000')
    cy.wait(1500)
  });

  it('click delete fruit', () => {
    cy.get('.btn-delete').first().click();
    cy.url().should('include', '/')
    cy.wait(1500)
  });

});
