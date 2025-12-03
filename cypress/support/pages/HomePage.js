class HomePage {
  // Selectors
  get searchInput() { 
    return cy.get('input.search, input[type="search"], input[name*="search"], input[id*="search"]').first(); 
  }
  
  get searchIcon() { 
    return cy.get('.search-icon, button.search-toggle, a.search-toggle, .header-search, [class*="search"] svg, [class*="search"] i').first(); 
  }
  
  get homeButton() { 
    return cy.get('.logo, .home-link, a[href="/"]').first(); 
  }
  
  get categoryLinks() { 
    return cy.get('a[href*="category"], a[href*="cat"], nav a, .menu a, .category a, .nav-item a, .prodLink'); 
  }
  
  get cartButton() { 
    return cy.get('a.cart-link, a[href*="cart"], .cart, .basket, #cart').first(); 
  }

  // Methods
  visit() {
    cy.visit('/');
    cy.wait(2000);
  }

  search(text) {
    // Try to reveal search box if hidden behind icon
    cy.get('body').then($body => {
      if ($body.find('.search-icon').length > 0) {
        this.searchIcon.click({ force: true });
        cy.wait(500);
      }
    });
    
    this.searchInput.clear().type(text);
    cy.wait(500);
    
    // Try pressing ENTER
    this.searchInput.type('{enter}');
  }

  goToHome() {
    this.homeButton.click();
    cy.wait(1000);
  }

  openCategoryByName(categoryName) {
    cy.wait(2000); // wait for page to fully load
    
    cy.log(`Searching for category: '${categoryName}'`);
    
    this.categoryLinks.each(($el) => {
      const text = $el.text().trim();
      if (text && (text.includes(categoryName) || categoryName.includes(text))) {
        cy.log(`✓ Match found! Clicking: '${text}'`);
        cy.wrap($el).click();
        return false; // break the loop
      }
    });
  }

  goToCart() {
    this.cartButton.click();
    cy.wait(1000);
  }
}

export default HomePage;
