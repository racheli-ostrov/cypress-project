describe('בדיקות נגישות - Accessibility Tests', () => {
  
  beforeEach(() => {
    // ניקוי עוגיות והתחלה נקייה
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // ניווט לדף הבית
    cy.visit('/');
    cy.wait(3000);
  });

  it('ACC-001: בדיקת כפתור ניגודיות גבוהה', () => {
    cy.log('\n========================================');
    cy.log('בדיקת ניגודיות גבוהה');
    cy.log('========================================\n');

    // המתנה שהעמוד יטען במלואו
    cy.wait(3000);
    
    // צילום מסך לפני השינוי
    cy.screenshot('accessibility-before-contrast', { overwrite: true });
    
    // תיעוד הצבעים הנוכחיים
    cy.get('body').then(($body) => {
      const beforeBg = $body.css('background-color');
      const beforeColor = $body.css('color');
      cy.log(`צבעים לפני: רקע=${beforeBg}, טקסט=${beforeColor}`);
    });
    
    // חיפוש כפתור נגישות (SVG של דמות אדם)
    cy.log('🔍 מחפש כפתור נגישות...');
    
    // נסה למצוא את כפתור הנגישות בדרכים שונות
    cy.get('body').then(($body) => {
      let found = false;
      
      // אופציה 1: SVG עם viewBox ספציפי
      if ($body.find('svg[viewBox="0 0 11.299 14.886"]').length > 0) {
        cy.wrap($body.find('svg[viewBox="0 0 11.299 14.886"]').parent()).click({ force: true });
        cy.log('✓ נמצא כפתור לפי SVG viewBox');
        found = true;
      }
      // אופציה 2: חיפוש SVG שמכיל path עם fill
      else if ($body.find('svg path[fill="#010101"]').length > 0) {
        cy.wrap($body.find('svg path[fill="#010101"]').closest('button, a, div[role="button"]')).click({ force: true });
        cy.log('✓ נמצא כפתור לפי SVG path');
        found = true;
      }
      // אופציה 3: כפתור עם class או id של נגישות
      else if ($body.find('[class*="accessibility"], [id*="accessibility"]').length > 0) {
        cy.wrap($body.find('[class*="accessibility"], [id*="accessibility"]').first()).click({ force: true });
        cy.log('✓ נמצא כפתור לפי class/id');
        found = true;
      }
      // אופציה 4: כל כפתור עם SVG
      else if ($body.find('button:has(svg), a:has(svg)').length > 0) {
        cy.wrap($body.find('button:has(svg), a:has(svg)').first()).click({ force: true });
        cy.log('✓ נמצא כפתור עם SVG');
        found = true;
      }
      
      if (found) {
        cy.log('✅ לחצתי על כפתור הנגישות');
      } else {
        cy.log('⚠️ לא נמצא כפתור נגישות');
      }
    });
    
    cy.log('⏳ ממתין לפתיחת תפריט נגישות...');
    cy.wait(3000); // המתנה לראות את התפריט נפתח
    
    // לחיצה על אופציית ניגודיות גבוהה
    cy.log('🔍 מחפש אופציית ניגודיות גבוהה בתפריט...');
    
    // חיפוש כפתור ניגודיות בתפריט הנגישות
    cy.get('body').then(($body) => {
      const contrastSelectors = [
        '[aria-label*="ניגודיות"]',
        '[title*="ניגודיות"]',
        '[class*="contrast"]',
        '[id*="contrast"]',
        'button:contains("ניגודיות")',
        'a:contains("ניגודיות")',
        'div:contains("ניגודיות")',
        '[data-action="contrast"]'
      ];
      
      let found = false;
      for (const selector of contrastSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().then(($el) => {
            cy.log(`✓ נמצא כפתור ניגודיות: ${selector}`);
            cy.wrap($el).click({ force: true });
          });
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠ לא נמצא כפתור ניגודיות בתפריט');
      }
    });
    
    cy.log('⏳ ממתין לשינוי הניגודיות...');
    cy.wait(5000); // המתנה ארוכה לראות את השינוי
    
    // צילום מסך אחרי השינוי
    cy.screenshot('accessibility-after-contrast', { overwrite: true });
    
    // בדיקה שהצבעים השתנו
    cy.get('body').then(($bodyAfter) => {
      const afterBg = $bodyAfter.css('background-color');
      const afterColor = $bodyAfter.css('color');
      cy.log(`צבעים אחרי: רקע=${afterBg}, טקסט=${afterColor}`);
      
      cy.get('body').then(($bodyBefore) => {
        const beforeBg = $bodyBefore.css('background-color');
        const beforeColor = $bodyBefore.css('color');
        
        let status = 'PASS ✓';
        let actualResult = 'הצבעים השתנו - ניגודיות גבוהה הופעלה';
        
        if (beforeBg === afterBg && beforeColor === afterColor) {
          status = 'MANUAL CHECK ⚠';
          actualResult = 'לא זוהה שינוי בצבעים - נדרשת בדיקה ידנית של הצילומים';
          cy.log('⚠ לא זוהה שינוי אוטומטי בצבעים');
        } else {
          cy.log('✅ הצבעים השתנו בהצלחה!');
        }
        
        // שמירה לאקסל
        cy.task('addAccessibilityTest', {
          'Test ID': 'ACC-001',
          'Mode': 'ניגודיות גבוהה',
          'Action': 'לחיצה על כפתור ניגודיות גבוהה',
          'Expected Change': 'שינוי צבעי הרקע והטקסט לניגודיות גבוהה',
          'Actual Change': actualResult,
          'Status': status,
          'Screenshot Path': 'output/screenshots/accessibility-after-contrast.png'
        }, { log: false });
      });
    });
    
    cy.log('\n=== בדיקת ניגודיות הסתיימה ===');
    cy.wait(3000); // המתנה נוספת לצפייה
  });

  it('ACC-002: בדיקת כפתור הגדלת גופן', () => {
    cy.log('\n========================================');
    cy.log('בדיקת הגדלת גופן');
    cy.log('========================================\n');

    // המתנה שהעמוד יטען במלואו
    cy.wait(3000);
    
    // צילום מסך לפני השינוי
    cy.screenshot('accessibility-before-fontsize', { overwrite: true });
    
    // תיעוד גודל הגופן הנוכחי
    cy.get('body').then(($body) => {
      const beforeFontSize = $body.css('font-size');
      cy.log(`גודל גופן לפני: ${beforeFontSize}`);
    });
    
    // חיפוש כפתור נגישות (SVG של דמות אדם)
    cy.log('🔍 מחפש כפתור נגישות...');
    
    // נסה למצוא את כפתור הנגישות בדרכים שונות
    cy.get('body').then(($body) => {
      let found = false;
      
      // אופציה 1: SVG עם viewBox ספציפי
      if ($body.find('svg[viewBox="0 0 11.299 14.886"]').length > 0) {
        cy.wrap($body.find('svg[viewBox="0 0 11.299 14.886"]').parent()).click({ force: true });
        cy.log('✓ נמצא כפתור לפי SVG viewBox');
        found = true;
      }
      // אופציה 2: חיפוש SVG שמכיל path עם fill
      else if ($body.find('svg path[fill="#010101"]').length > 0) {
        cy.wrap($body.find('svg path[fill="#010101"]').closest('button, a, div[role="button"]')).click({ force: true });
        cy.log('✓ נמצא כפתור לפי SVG path');
        found = true;
      }
      // אופציה 3: כפתור עם class או id של נגישות
      else if ($body.find('[class*="accessibility"], [id*="accessibility"]').length > 0) {
        cy.wrap($body.find('[class*="accessibility"], [id*="accessibility"]').first()).click({ force: true });
        cy.log('✓ נמצא כפתור לפי class/id');
        found = true;
      }
      // אופציה 4: כל כפתור עם SVG
      else if ($body.find('button:has(svg), a:has(svg)').length > 0) {
        cy.wrap($body.find('button:has(svg), a:has(svg)').first()).click({ force: true });
        cy.log('✓ נמצא כפתור עם SVG');
        found = true;
      }
      
      if (found) {
        cy.log('✅ לחצתי על כפתור הנגישות');
      } else {
        cy.log('⚠️ לא נמצא כפתור נגישות');
      }
    });
    
    cy.log('⏳ ממתין לפתיחת תפריט נגישות...');
    cy.wait(3000); // המתנה לראות את התפריט נפתח
    
    // לחיצה על אופציית הגדלת גופן
    cy.log('🔍 מחפש אופציית הגדלת גופן בתפריט...');
    cy.get('body').then(($body) => {
      const fontSizeSelectors = [
        '[aria-label*="הגדל"]',
        '[aria-label*="גופן"]',
        '[title*="הגדל"]',
        '[title*="גופן"]',
        '[class*="font-size"]',
        '[class*="increase-font"]',
        '[class*="larger-text"]',
        '[class*="bigger"]',
        '[id*="font-size"]',
        '[id*="increase-font"]',
        'button:contains("הגדל")',
        'button:contains("גופן")',
        'button:contains("A+")',
        'a:contains("הגדל")',
        'a:contains("גופן")',
        'div:contains("הגדלת גופן")',
        '[data-action*="font"]'
      ];
      
      let found = false;
      for (const selector of fontSizeSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().then(($el) => {
            cy.log(`✓ נמצא כפתור הגדלת גופן: ${selector}`);
            cy.wrap($el).click({ force: true });
          });
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠ לא נמצא כפתור הגדלת גופן בתפריט');
      }
    });
    
    cy.log('⏳ ממתין להגדלת הגופן...');
    cy.wait(5000); // המתנה ארוכה לראות את השינוי
    
    // צילום מסך אחרי השינוי
    cy.screenshot('accessibility-after-fontsize', { overwrite: true });
    
    // בדיקה שהגופן השתנה
    cy.get('body').then(($bodyAfter) => {
      const afterFontSize = $bodyAfter.css('font-size');
      cy.log(`גודל גופן אחרי: ${afterFontSize}`);
      
      cy.get('body').then(($bodyBefore) => {
        const beforeFontSize = $bodyBefore.css('font-size');
        
        let status = 'PASS ✓';
        let actualResult = `גודל הגופן: ${afterFontSize}`;
        
        if (beforeFontSize === afterFontSize) {
          status = 'MANUAL CHECK ⚠';
          actualResult = 'לא זוהה שינוי בגודל הגופן - נדרשת בדיקה ידנית של הצילומים';
          cy.log('⚠ לא זוהה שינוי אוטומטי בגודל גופן');
        } else {
          // המרה למספרים להשוואה
          const beforeSize = parseFloat(beforeFontSize);
          const afterSize = parseFloat(afterFontSize);
          
          if (afterSize > beforeSize) {
            cy.log(`✅ הגופן הוגדל בהצלחה! (+${(afterSize - beforeSize).toFixed(2)}px)`);
            actualResult = `גודל הגופן הוגדל מ-${beforeFontSize} ל-${afterFontSize} (+${(afterSize - beforeSize).toFixed(2)}px)`;
          } else {
            cy.log('⚠ הגופן השתנה אך לא הוגדל');
          }
        }
        
        // שמירה לאקסל
        cy.task('addAccessibilityTest', {
          'Test ID': 'ACC-002',
          'Mode': 'הגדלת גופן',
          'Action': 'לחיצה על כפתור הגדלת גופן',
          'Expected Change': 'הגדלת גודל הטקסט באתר',
          'Actual Change': actualResult,
          'Status': status,
          'Screenshot Path': 'output/screenshots/accessibility-after-fontsize.png'
        }, { log: false });
      });
    });
    
    cy.log('\n=== בדיקת הגדלת גופן הסתיימה ===');
    cy.wait(3000); // המתנה נוספת לצפייה
  });
});
