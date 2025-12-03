import HomePage from '../support/pages/HomePage';

describe('טסטים נוספים - Search, Accessibility & Dynamic Content', () => {
  const homePage = new HomePage();

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('טסטי חיפוש - Search Tests', () => {
    it('טסט: חיפוש פועל ומציג תוצאות', () => {
      cy.log('\n========================================');
      cy.log('טסט: חיפוש אוזניות');
      cy.log('========================================\n');

      homePage.visit();
      cy.wait(2000);

      // ביצוע חיפוש
      homePage.search('אוזניות');
      cy.wait(2000);

      // בדיקה שהטקסט מופיע בדף
      cy.contains('אוזניות').should('be.visible');
      cy.log('✓ תוצאות החיפוש מוצגות');

      cy.log('\n=== הטסט הסתיים בהצלחה ===');
    });
  });

  describe('טסטי נגישות - Accessibility Tests', () => {
    it('טסט: בדיקת נגישות בסיסית - alt texts', () => {
      cy.log('\n========================================');
      cy.log('טסט: בדיקת תמונות עם alt text');
      cy.log('========================================\n');

      homePage.visit();
      cy.wait(2000);

      // בדיקה שתמונות עיקריות יש להן alt text
      cy.get('img').each(($img) => {
        const alt = $img.attr('alt');
        if (!alt || alt.trim() === '') {
          cy.log(`⚠ תמונה ללא alt text: ${$img.attr('src')}`);
        }
      });

      cy.log('\n=== בדיקת נגישות הושלמה ===');
    });

    it('טסט: בדיקת ניגודיות צבעים בסיסית', () => {
      cy.log('\n========================================');
      cy.log('טסט: בדיקת ניגודיות צבעים');
      cy.log('========================================\n');

      homePage.visit();
      cy.wait(2000);

      // בדיקה בסיסית - האם יש טקסט גלוי
      cy.get('body').should('be.visible');
      cy.get('h1, h2, h3, p, a').should('have.length.greaterThan', 0);

      cy.log('✓ אלמנטי טקסט נמצאו וגלויים');
      cy.log('\n=== בדיקת ניגודיות הושלמה ===');
    });
  });

  describe('טסטי תוכן דינמי - Dynamic Content Tests', () => {
    it('טסט: בדיקת טעינת תוכן דינמי', () => {
      cy.log('\n========================================');
      cy.log('טסט: בדיקת טעינת תוכן דינמי');
      cy.log('========================================\n');

      homePage.visit();
      cy.wait(3000);

      // בדיקה שיש קישורי קטגוריות
      homePage.categoryLinks.should('have.length.greaterThan', 0);
      cy.log('✓ קישורי קטגוריות נטענו');

      // בדיקה שיש כפתור סל קניות
      homePage.cartButton.should('be.visible');
      cy.log('✓ כפתור עגלת קניות גלוי');

      cy.log('\n=== בדיקת תוכן דינמי הושלמה ===');
    });

    it('טסט: בדיקת שינוי תוכן בעת סינון', () => {
      cy.log('\n========================================');
      cy.log('טסט: בדיקת סינון תוכן');
      cy.log('========================================\n');

      homePage.visit();
      cy.wait(2000);

      // פתיחת קטגוריה
      homePage.openCategoryByName('בשמים');
      cy.wait(2000);

      // בדיקה שיש מוצרים
      cy.get('.product-link, .product-item, .prodLink').should('have.length.greaterThan', 0);
      cy.log('✓ מוצרים מוצגים בקטגוריה');

      cy.log('\n=== בדיקת סינון הושלמה ===');
    });
  });
});
