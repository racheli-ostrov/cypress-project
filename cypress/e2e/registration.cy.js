import HomePage from '../support/pages/HomePage';
import RegistrationPage from '../support/pages/RegistrationPage';

describe('טסטים לטופס הרשמה - Registration Form Tests', () => {
  const homePage = new HomePage();
  const registrationPage = new RegistrationPage();
  let uniqueEmail;

  before(() => {
    // יצירת אימייל ייחודי
    const timestamp = new Date().getTime();
    uniqueEmail = `test${timestamp}@example.com`;
    cy.log(`=== אימייל ייחודי: ${uniqueEmail} ===`);
  });

  beforeEach(() => {
    // מחיקת עוגיות והתנתקות מהמערכת לפני כל טסט
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('טסט 1: הרשמה מוצלחת עם כל הפרטים', () => {
    cy.log('\n========================================');
    cy.log('טסט 1: הרשמה מוצלחת');
    cy.log('========================================\n');

    // ניווט לדף הבית
    homePage.visit();
    cy.wait(2000);

    // מעבר לדף הרשמה
    registrationPage.navigateToRegistrationFromHome();

    // נתוני הבדיקה
    const testData = {
      email: uniqueEmail,
      password: 'Password123!',
      passwordConfirm: 'Password123!',
      firstName: 'יוסי',
      lastName: 'כהן',
      city: 'תל אביב - יפו',
      street: 'הרצל',
      houseNumber: '25',
      entrance: 'ג',
      apartment: '5',
      phone1: '0541234579',
      phone2: '0501234579'
    };

    // מילוי הטופס
    registrationPage.fillRegistrationForm(testData);
    cy.wait(2000);

    // לחיצה על כפתור הרשמה
    registrationPage.submit();
    cy.wait(5000);

    cy.log('\n=== טסט 1 הסתיים בהצלחה ===');
  });

  it('טסט 2: ניסיון הרשמה עם אימייל קיים', () => {
    cy.log('\n========================================');
    cy.log('טסט 2: ניסיון הרשמה עם אימייל קיים');
    cy.log('========================================\n');

    // ניווט לדף הבית
    homePage.visit();
    cy.wait(2000);

    // מעבר לדף הרשמה
    registrationPage.navigateToRegistrationFromHome();

    // נתוני בדיקה - אימייל זהה, שאר הפרטים שונים
    const testData = {
      email: uniqueEmail, // אימייל זהה למשתמש הראשון!
      password: 'DifferentPass456!',
      passwordConfirm: 'DifferentPass456!',
      firstName: 'דוד',
      lastName: 'לוי',
      city: 'חיפה',
      street: 'בן גוריון',
      houseNumber: '10',
      entrance: 'א',
      apartment: '3',
      phone1: '0527654321',
      phone2: '0507654321'
    };

    cy.log(`\n=== מתחיל למלא טופס עם אימייל קיים: ${uniqueEmail} ===`);

    // מילוי הטופס
    registrationPage.fillRegistrationForm(testData);
    cy.wait(2000);

    // לחיצה על כפתור הרשמה
    registrationPage.submit();
    cy.wait(3000);

    // בדיקה שהמערכת הציגה הודעת שגיאה
    cy.log('\n=== בודק הודעת שגיאה (מצופה למצוא שגיאה!) ===');
    cy.get('.error, .text-danger, [class*="error"], .invalid-feedback, .alert-danger, .alert')
      .should('be.visible')
      .then(($error) => {
        const errorText = $error.text().trim();
        cy.log(`✓✓✓ נמצאה הודעת שגיאה (כמצופה!): ${errorText}`);
      });

    cy.log('\n=== טסט 2 הסתיים ===');
  });

  it('טסט 3: אימות שדות חובה - אימייל וסיסמה ריקים', () => {
    cy.log('\n========================================');
    cy.log('טסט 3: אימות שדות חובה');
    cy.log('========================================\n');

    // ניווט לדף הבית
    homePage.visit();
    cy.wait(2000);

    // מעבר לדף הרשמה
    registrationPage.navigateToRegistrationFromHome();

    // נתוני בדיקה - משאירים שדה אימייל וסיסמה ריקים
    const testData = {
      email: '', // ריק!
      password: '', // ריק!
      passwordConfirm: '',
      firstName: 'רחל',
      lastName: 'כהן',
      city: 'ירושלים',
      street: 'יפו',
      houseNumber: '15',
      entrance: 'ב',
      apartment: '7',
      phone1: '0523456789',
      phone2: '0503456789'
    };

    cy.log('\n=== מתחיל למלא טופס עם שדות חובה ריקים ===');
    cy.log('אימייל: [ריק] - שדה חובה!');
    cy.log('סיסמה: [ריקה] - שדה חובה!');

    // מילוי הטופס
    registrationPage.fillRegistrationForm(testData);
    cy.wait(2000);

    // ניסיון לשליחה
    cy.log('\n=== מנסה לשלוח טופס עם שדות חובה חסרים ===');
    registrationPage.submit();
    cy.wait(2000);

    // בדיקה שנשארנו בעמוד ההרשמה (לא עבר לעמוד אחר)
    cy.url().should('include', 'Register');
    cy.log('✓✓✓ נשארנו בעמוד ההרשמה - המערכת מנעה שליחה (כמצופה!)');

    cy.log('\n=== טסט 3 הסתיים ===');
  });

  it('טסט 4: אימות טלפון עם אותיות', () => {
    cy.log('\n========================================');
    cy.log('טסט 4: אימות טלפון עם אותיות');
    cy.log('========================================\n');

    // יצירת אימייל ייחודי חדש
    const timestamp = new Date().getTime();
    const newEmail = `test${timestamp}@example.com`;

    // ניווט לדף הבית
    homePage.visit();
    cy.wait(2000);

    // מעבר לדף הרשמה
    registrationPage.navigateToRegistrationFromHome();

    // נתוני בדיקה - טלפון שני עם אותיות
    const testData = {
      email: newEmail,
      password: 'ValidPass789!',
      passwordConfirm: 'ValidPass789!',
      firstName: 'מיכל',
      lastName: 'אברהם',
      city: 'באר שבע',
      street: 'הנגב',
      houseNumber: '50',
      entrance: 'ד',
      apartment: '12',
      phone1: '0534567891', // תקין
      phone2: 'ABC1234567' // עם אותיות!
    };

    cy.log('\n=== מתחיל למלא טופס עם טלפון שני לא תקין ===');
    cy.log('טלפון נייד: 0534567891 [תקין]');
    cy.log('טלפון נוסף: ABC1234567 [עם אותיות!]');

    // מילוי הטופס
    registrationPage.fillRegistrationForm(testData);
    cy.wait(2000);

    // ניסיון לשליחה
    cy.log('\n=== מנסה לשלוח טופס עם טלפון שני לא תקין ===');
    registrationPage.submit();
    cy.wait(3000);

    // בדיקה שנשארנו בעמוד ההרשמה
    cy.url().should('include', 'Register');
    cy.log('✓✓✓ נשארנו בעמוד ההרשמה - המערכת מנעה שליחה (כמצופה!)');

    cy.log('\n=== טסט 4 הסתיים ===');
  });
});
