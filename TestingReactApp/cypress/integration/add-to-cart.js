describe('Visit the client and add to cart', () => {

  it('run process', () => {
    cy.visit('http://localhost:3000')
    cy.wait(1500)
    cy.get('.fruit').then(fruits => {
      cy.get('.cart-icon').click()
      cy.wait(2000)
      cy.get('.btn-add').each(btn => {
        btn.click()
      });
      cy.wait(1000)
      cy.get('#submit-cart').click();
      cy.wait(1500);
      cy.reload();
    })
  });
});
