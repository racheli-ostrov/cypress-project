class CategoryPage {
  // Selectors
  get productLinks() { 
    return cy.get('.product-link, .product-item a, [class*="product"] a, .prodLink'); 
  }

  // Methods
  openProductByIndex(index) {
    cy.log(`=== פותח מוצר מספר ${index} ===`);
    this.productLinks.eq(index).click({ force: true });
    cy.wait(2000);
    cy.log('✓ המוצר נפתח');
  }

  openProductByName(productName) {
    cy.log(`=== מחפש מוצר: ${productName} ===`);
    this.productLinks.contains(productName).click({ force: true });
    cy.wait(2000);
    cy.log('✓ המוצר נפתח');
  }
}

export default CategoryPage;
