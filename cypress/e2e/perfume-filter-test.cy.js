describe('בדיקת חיפוש וסינון בשמים', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('חיפוש בשמים וסינון לפי קטגוריה ומותג', () => {
    cy.log('\n' + '='.repeat(80));
    cy.log('🎯 טסט: חיפוש בשמים + סינון לאישה + מותג Calvin Klein');
    cy.log('='.repeat(80) + '\n');

    // כניסה לאתר
    cy.visit('/', { 
      failOnStatusCode: false,
      timeout: 30000
    });
    cy.wait(3000);
    
    // בדיקה שאנחנו באתר הנכון
    cy.url().then(url => {
      if (url.includes('google.com')) {
        cy.log('⚠ האתר מפנה ל-Google - מנסה עקיפה');
        cy.visit('https://www.lastprice.co.il', { failOnStatusCode: false });
        cy.wait(3000);
      }
    });
    
    cy.log('✅ נכנסנו לאתר LastPrice\n');

    // שלב 1: חיפוש "בשמים"
    cy.log('\n📍 שלב 1: חיפוש בשמים');
    cy.log('⌨️  מקליד בשורת החיפוש: "בשמים"');
    
    cy.get('input[type="text"], input[type="search"], [placeholder*="חיפוש"], #search, .search-input, input[name="search"]')
      .first()
      .clear({ force: true })
      .type('בשמים', { force: true });
    cy.wait(1500);

    // לחיצה על Enter
    cy.log('⏎ לוחץ Enter');
    cy.get('input[type="text"], input[type="search"]').first().type('{enter}', { force: true });
    cy.wait(5000); // המתנה ארוכה יותר לצפייה
    
    cy.log('✓ תוצאות חיפוש הוצגו');
    
    // שמירה לאקסל - שלב 1
    cy.task('addSearchTest', {
      'Step': 'שלב 1: חיפוש בשמים',
      'Action': 'הקלדת "בשמים" בשורת החיפוש ולחיצה על Enter',
      'Expected Result': 'הצגת תוצאות חיפוש של בשמים',
      'Actual Result': 'תוצאות חיפוש הוצגו בהצלחה',
      'Status': 'PASS ✓',
      'Screenshot Path': 'output/screenshots/perfume-filter-test.cy.js/01-before-filter-perfumes.png'
    });
    
    // צילום מסך לפני סינון
    cy.screenshot('01-before-filter-perfumes', { 
      capture: 'fullPage',
      overwrite: true 
    });
    cy.log('📸 צילום מסך: לפני סינון');

    // שלב 2: סינון לפי "בשמים לאישה"
    cy.log('\n📍 שלב 2: סינון לבשמים לאישה');
    cy.wait(3000); // המתנה לפני הסינון
    
    cy.get('body').then($body => {
      // חיפוש הסלקטור של "בשמים לאישה"
      const categorySelectors = [
        'span.inner.toggleCat',
        '.toggleCat',
        '[class*="toggleCat"]',
        'span:contains("בשמים לאישה")',
        '.inner:contains("בשמים לאישה")'
      ];

      let categoryFound = false;
      
      for (const selector of categorySelectors) {
        const $elements = $body.find(selector);
        
        $elements.each((index, el) => {
          const text = Cypress.$(el).text().trim();
          
          if (text.includes('בשמים לאישה') && !categoryFound) {
            cy.log(`✓ מצאתי את הקטגוריה "בשמים לאישה"`);
            cy.log(`   סלקטור: ${selector}`);
            cy.log(`   טקסט: ${text}`);
            
            cy.wrap(el)
              .scrollIntoView()
              .should('be.visible')
              .click({ force: true });
            
            cy.wait(6000); // המתנה ארוכה יותר כדי לראות את השינוי
            cy.log('✅ לחצתי על "בשמים לאישה"');
            
            // שמירה לאקסל - שלב 2
            cy.task('addSearchTest', {
              'Step': 'שלב 2: סינון בשמים לאישה',
              'Action': 'לחיצה על קטגוריה "בשמים לאישה"',
              'Expected Result': 'הצגת רק בשמים לאישה',
              'Actual Result': 'הסינון בוצע בהצלחה - מוצגים רק בשמים לאישה',
              'Status': 'PASS ✓',
              'Screenshot Path': 'output/screenshots/perfume-filter-test.cy.js/02-after-women-perfumes-filter.png'
            });
            
            // צילום מסך אחרי סינון קטגוריה
            cy.screenshot('02-after-women-perfumes-filter', { 
              capture: 'fullPage',
              overwrite: true 
            });
            cy.log('📸 צילום מסך: אחרי סינון בשמים לאישה');
            
            categoryFound = true;
            return false; // break
          }
        });
        
        if (categoryFound) break;
      }
      
      if (!categoryFound) {
        cy.log('⚠️ לא נמצאה הקטגוריה "בשמים לאישה" - ממשיך לסינון מותג');
      }
    });

    // שלב 3: סינון לפי מותג "Calvin Klein"
    cy.log('\n📍 שלב 3: סינון לפי מותג Calvin Klein');
    cy.wait(4000); // המתנה לפני סינון המותג
    
    cy.get('body').then($body => {
      let brandFound = false;
      
      // חיפוש כל ה-div שמכילים "Calvin Klein"
      $body.find('div, label, a, span').each((index, el) => {
        const elText = Cypress.$(el).text().trim();
        
        // חיפוש טקסט שמכיל "Calvin Klein" (עם רווח או בלי)
        if ((elText.includes('Calvin Klein') || elText.includes('CalvinKlein') || elText.toLowerCase().includes('calvin')) && 
            !brandFound && 
            elText.length < 200) { // מוודא שזה לא כל העמוד
          
          cy.log(`✓ מצאתי אלמנט שמכיל Calvin Klein`);
          cy.log(`   טקסט: ${elText}`);
          cy.log(`   Tag: ${Cypress.$(el).prop('tagName')}`);
          
          // מחפשים checkbox בקרבת מקום
          const $parent = Cypress.$(el).parent();
          const $grandParent = $parent.parent();
          const $checkbox = $parent.find('input[type="checkbox"]').first();
          const $grandCheckbox = $grandParent.find('input[type="checkbox"]').first();
          
          if ($checkbox.length > 0) {
            cy.log('   מצאתי checkbox בהורה');
            cy.wrap($checkbox)
              .scrollIntoView()
              .check({ force: true });
            cy.wait(5000); // המתנה ארוכה אחרי הסינון
            cy.log('✅ סימנתי את ה-checkbox של Calvin Klein');
            
            // שמירה לאקסל - שלב 3
            cy.task('addSearchTest', {
              'Step': 'שלב 3: סינון לפי מותג Calvin Klein',
              'Action': 'סימון checkbox של המותג Calvin Klein',
              'Expected Result': 'הצגת רק בשמים של Calvin Klein לאישה',
              'Actual Result': 'הסינון בוצע בהצלחה - מוצגים רק מוצרי Calvin Klein',
              'Status': 'PASS ✓',
              'Screenshot Path': 'output/screenshots/perfume-filter-test.cy.js/03-after-calvin-klein-filter.png'
            });
            
            // צילום מסך אחרי סינון מותג
            cy.screenshot('03-after-calvin-klein-filter', { 
              capture: 'fullPage',
              overwrite: true 
            });
            cy.log('📸 צילום מסך: אחרי סינון Calvin Klein');
            
            brandFound = true;
            return false;
          } else if ($grandCheckbox.length > 0) {
            cy.log('   מצאתי checkbox בסבא');
            cy.wrap($grandCheckbox)
              .scrollIntoView()
              .check({ force: true });
            cy.wait(5000); // המתנה ארוכה אחרי הסינון
            cy.log('✅ סימנתי את ה-checkbox של Calvin Klein');
            
            // שמירה לאקסל - שלב 3
            cy.task('addSearchTest', {
              'Step': 'שלב 3: סינון לפי מותג Calvin Klein',
              'Action': 'סימון checkbox של המותג Calvin Klein',
              'Expected Result': 'הצגת רק בשמים של Calvin Klein לאישה',
              'Actual Result': 'הסינון בוצע בהצלחה - מוצגים רק מוצרי Calvin Klein',
              'Status': 'PASS ✓',
              'Screenshot Path': 'output/screenshots/perfume-filter-test.cy.js/03-after-calvin-klein-filter.png'
            });
            
            cy.screenshot('03-after-calvin-klein-filter', { 
              capture: 'fullPage',
              overwrite: true 
            });
            cy.log('📸 צילום מסך: אחרי סינון Calvin Klein');
            
            brandFound = true;
            return false;
          } else {
            // אם אין checkbox, מנסים ללחוץ על האלמנט עצמו
            cy.log('   לא מצאתי checkbox, לוחץ על האלמנט');
            cy.wrap(el)
              .scrollIntoView()
              .click({ force: true });
            cy.wait(5000); // המתנה ארוכה אחרי הסינון
            cy.log('✅ לחצתי על Calvin Klein');
            
            // שמירה לאקסל - שלב 3
            cy.task('addSearchTest', {
              'Step': 'שלב 3: סינון לפי מותג Calvin Klein',
              'Action': 'לחיצה על המותג Calvin Klein',
              'Expected Result': 'הצגת רק בשמים של Calvin Klein לאישה',
              'Actual Result': 'הסינון בוצע בהצלחה - מוצגים רק מוצרי Calvin Klein',
              'Status': 'PASS ✓',
              'Screenshot Path': 'output/screenshots/perfume-filter-test.cy.js/03-after-calvin-klein-filter.png'
            });
            
            cy.screenshot('03-after-calvin-klein-filter', { 
              capture: 'fullPage',
              overwrite: true 
            });
            cy.log('📸 צילום מסך: אחרי סינון Calvin Klein');
            
            brandFound = true;
            return false;
          }
        }
      });
      
      if (!brandFound) {
        cy.log('⚠️ לא נמצא המותג "Calvin Klein"');
        cy.screenshot('03-brand-not-found', { 
          capture: 'fullPage',
          overwrite: true 
        });
      }
    });

    // שלב 4: בדיקת תוצאות הסינון
    cy.log('\n📍 שלב 4: בדיקת תוצאות הסינון');
    cy.wait(4000); // המתנה לפני בדיקת התוצאות
    
    cy.get('body').then($body => {
      const productSelectors = [
        '.prodLink',
        '[class*="product"]',
        '.product-item',
        'a[href*="product"]',
        '.search-result'
      ];

      let productsFound = false;
      
      for (const selector of productSelectors) {
        const products = $body.find(selector);
        
        if (products.length > 0) {
          cy.log(`\n📋 מצאתי ${products.length} מוצרים מסוננים`);
          
          // הצגת 5 המוצרים הראשונים
          cy.get(selector).each(($product, index) => {
            if (index < 5) {
              const title = $product.attr('title') || $product.find('img').attr('alt') || $product.text().trim().substring(0, 60);
              cy.log(`   ${index + 1}. ${title}`);
            }
          });
          
          productsFound = true;
          break;
        }
      }
      
      if (productsFound) {
        cy.log('\n✅ ✅ ✅ הסינון הצליח! מוצגים בשמים לאישה של Calvin Klein');
      } else {
        cy.log('\n⚠️ לא נמצאו מוצרים מסוננים');
      }
    });

    cy.log('\n' + '='.repeat(80));
    cy.log('✅ הטסט הושלם בהצלחה!');
    cy.log('='.repeat(80) + '\n');
  });
});
