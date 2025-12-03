class CartPage {
  // Selectors
  get cartItems() { 
    return cy.get('.cart-item, .product-item, [class*="cart"] [class*="item"]'); 
  }
  
  get cartTotal() { 
    return cy.get('.cart-total, .total-price, [class*="total"]').first(); 
  }
  
  get checkoutButton() { 
    return cy.get('.checkout-button, button[class*="checkout"], a[href*="checkout"]').first(); 
  }

  // Methods
  getCartItemsData() {
    const items = [];
    
    this.cartItems.each(($item) => {
      const name = $item.find('.product-name, [class*="name"]').text().trim();
      const price = $item.find('.price, [class*="price"]').text().trim();
      const quantity = $item.find('.quantity, input[type="number"]').val() || '1';
      
      items.push({ name, price, quantity });
    });
    
    return cy.wrap(items);
  }

  verifyCartHasItems(minCount = 1) {
    this.cartItems.should('have.length.at.least', minCount);
  }

  getTotalPrice() {
    return this.cartTotal.invoke('text');
  }

  proceedToCheckout() {
    this.checkoutButton.click();
    cy.wait(2000);
  }
}

export default CartPage;
