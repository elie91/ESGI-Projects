describe('Visit the client and go to add fruit', () => {

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

  it('click add fruit and go to the form', () => {
    cy.contains('Ajouter un fruit').click()
    cy.url().should('include', '/add-fruit')
    cy.wait(1500)
  })

  it('error name length', () => {
    cy.visit('http://localhost:3000/add-fruit')
    word = getRandomString(1);
    cy.get('#fruit')
      .type(word)
      .should('have.value', word)

    cy.get('form').submit();
    cy.get('.alert-danger').contains('Le nom du fruit doit faire au minimum 2 caractères')
    cy.wait(1500)
  });


  it('error name unique', () => {
    cy.visit('http://localhost:3000/add-fruit')
    word = getRandomString(1);
    cy.get('#fruit')
      .type('poire')
      .should('have.value', 'poire')

    cy.get('form').submit();
    cy.get('.alert-danger').contains('fruit name need to be unique')
    cy.wait(1500)
  });
})
