class ProductPage {
  // Selectors
  get productName() { 
    return cy.get('.product-name, h1, [class*="product"] h1, [class*="title"]').first(); 
  }
  
  get productPrice() { 
    return cy.get('.price, .product-price, [class*="price"]').first(); 
  }
  
  get quantityInput() { 
    return cy.get('input[type="number"], input[name*="quantity"], .quantity-input').first(); 
  }
  
  get addToCartButton() { 
    return cy.get('button:contains("הוסף לסל"), button[class*="add-to-cart"], .add-cart-btn').first(); 
  }

  // Methods
  getName() {
    return this.productName.invoke('text').then(text => text.trim());
  }

  getPrice() {
    return this.productPrice.invoke('text').then(text => text.trim());
  }

  setQuantity(quantity) {
    // Try to find quantity input, if not found - skip (some products don't have quantity selector)
    cy.get('body').then($body => {
      if ($body.find('input[type="number"], input[name*="quantity"], .quantity-input').length > 0) {
        this.quantityInput.clear().type(quantity.toString());
        cy.wait(500);
      } else {
        cy.log('⚠ שדה כמות לא נמצא - ממשיך ללא שינוי כמות');
      }
    });
  }

  addToCart() {
    cy.log('=== מוסיף מוצר לסל ===');
    this.addToCartButton.click({ force: true });
    cy.wait(2000);
    cy.log('✓ המוצר נוסף לסל');
  }
}

export default ProductPage;
