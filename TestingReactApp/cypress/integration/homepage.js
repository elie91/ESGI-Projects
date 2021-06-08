describe('Visit the homepage and check content', () => {

  it('Visits the client', () => {
    cy.visit('/')
  });

  it('check content', () => {
    cy.contains('Fruits')
    cy.contains('Mes fruits')
    cy.contains('Mes paniers fruités')
    cy.contains('Ajouter un fruit')
  });

  it('fetch fruits', () => {
    cy.request('http://localhost:8080/fruits').should((response) => {
      expect(response.status).to.eq(200)
      expect(response).to.have.property('headers')
    })
  })

  it('fetch carts', () => {
    cy.request('http://localhost:8080/carts').should((response) => {
      expect(response.status).to.eq(200)
      expect(response).to.have.property('headers')
    })
  })
})
