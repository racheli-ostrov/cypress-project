import HomePage from '../support/pages/HomePage';
import CategoryPage from '../support/pages/CategoryPage';
import ProductPage from '../support/pages/ProductPage';
import CartPage from '../support/pages/CartPage';

describe('טסטים לעגלת קניות - Cart Flow Tests', () => {
  const homePage = new HomePage();
  const categoryPage = new CategoryPage();
  const productPage = new ProductPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    // מחיקת עוגיות לפני כל טסט
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('טסט: הוספת מוצרים מ-3 קטגוריות שונות לסל', () => {
    cy.log('\n========================================');
    cy.log('טסט: הוספת מוצרים מ-3 קטגוריות לסל');
    cy.log('========================================\n');

    // ניווט לדף הבית
    homePage.visit();

    // קטגוריה 1: בשמים
    cy.log('\n=== קטגוריה 1: בשמים ===');
    homePage.openCategoryByName('בשמים');
    cy.wait(2000);
    
    categoryPage.openProductByIndex(0);
    cy.wait(2000);
    
    productPage.getName().then((name) => {
      cy.log(`שם המוצר: ${name}`);
    });
    
    productPage.getPrice().then((price) => {
      cy.log(`מחיר: ${price}`);
    });
    
    productPage.setQuantity(1);
    productPage.addToCart();

    // קטגוריה 2: סמארטפון
    cy.log('\n=== קטגוריה 2: סמארטפון ===');
    homePage.goToHome();
    cy.wait(1000);
    
    homePage.openCategoryByName('סמארטפון');
    cy.wait(2000);
    
    categoryPage.openProductByIndex(1);
    cy.wait(2000);
    
    productPage.getName().then((name) => {
      cy.log(`שם המוצר: ${name}`);
    });
    
    productPage.getPrice().then((price) => {
      cy.log(`מחיר: ${price}`);
    });
    
    productPage.setQuantity(2);
    productPage.addToCart();

    // קטגוריה 3: אביזרים
    cy.log('\n=== קטגוריה 3: אביזרים ===');
    homePage.goToHome();
    cy.wait(1000);
    
    homePage.openCategoryByName('אביזרים');
    cy.wait(2000);
    
    categoryPage.openProductByIndex(0);
    cy.wait(2000);
    
    productPage.getName().then((name) => {
      cy.log(`שם המוצר: ${name}`);
    });
    
    productPage.getPrice().then((price) => {
      cy.log(`מחיר: ${price}`);
    });
    
    productPage.setQuantity(1);
    productPage.addToCart();

    // מעבר לעגלת הקניות
    cy.log('\n=== מעבר לעגלת הקניות ===');
    homePage.goToCart();
    cy.wait(2000);

    // אימות שיש לפחות 3 פריטים בעגלה
    cartPage.verifyCartHasItems(3);
    cy.log('✓ נמצאו לפחות 3 פריטים בעגלה');

    // אימות שיש סכום כולל
    cartPage.getTotalPrice().then((total) => {
      expect(total).to.not.be.empty;
      cy.log(`✓ סכום כולל: ${total}`);
    });

    cy.log('\n=== הטסט הסתיים בהצלחה ===');
  });
});
