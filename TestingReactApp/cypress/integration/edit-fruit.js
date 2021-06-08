describe('Visit the client and edit fruit', () => {

  let word;
  function getRandomString(length) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for ( var i = 0; i < length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  it('Visits the client', () => {
    cy.visit('http://localhost:3000')
    cy.wait(1500)
  });

  it('click edit fruit and go to the form', () => {
    cy.get('.btn-edit').first().click();
    cy.url().should('include', '/edit-fruit')
    cy.wait(1500)
  });

  it('edit and submit success', () => {
    word = getRandomString(10);
    cy.get('#fruit')
      .clear()
      .type(word)
      .should('have.value', word)

    cy.get('form').submit();
    cy.url().should('equal', 'http://localhost:3000/')
    cy.wait(1500)
  });

});
