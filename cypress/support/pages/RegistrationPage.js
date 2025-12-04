class RegistrationPage {
  // Selectors
  get registrationForm() { 
    return cy.get('form.reg-form, form').first(); 
  }
  
  get emailField() { 
    return cy.get('input[name="cemail"]'); 
  }
  
  get password1Field() { 
    return cy.get('input[name="cpass1"]'); 
  }
  
  get password2Field() { 
    return cy.get('input[name="cpass2"]'); 
  }
  
  get firstNameField() { 
    return cy.get('input[name="cfname"]'); 
  }
  
  get lastNameField() { 
    return cy.get('input[name="clname"]'); 
  }
  
  get citySelect() { 
    return cy.get('#ccity-selection'); 
  }
  
  get streetField() { 
    return cy.get('input[name="cshn"]'); 
  }
  
  get houseNumberField() { 
    return cy.get('input[name="cstreetshn-1"]'); 
  }
  
  get entranceField() { 
    return cy.get('input[name="caddress2"]'); 
  }
  
  get apartmentField() { 
    return cy.get('input[name="caddress3"]'); 
  }
  
  get phone1Field() { 
    return cy.get('input[name="cphone1"]'); 
  }
  
  get phone2Field() { 
    return cy.get('input[name="cphone"]'); 
  }
  
  get contactListCheckbox() { 
    return cy.get('label[for="rf-ContactList"], label:has(input[name="ContactList"])'); 
  }
  
  get termsCheckbox() { 
    return cy.get('label[for="rf-UseTerms"], label:has(input[name="UseTerms"])'); 
  }
  
  get submitButton() { 
    return cy.get('form.reg-form input[type="submit"], form.reg-form button[type="submit"]').first(); 
  }

  // Methods
  visit() {
    cy.visit('/Register');
    cy.wait(3000);
  }

  fillRegistrationForm(data) {
    cy.log('=== מתחיל למלא את הטופס ===');
    
    // Email
    if (data.email) {
      this.emailField.scrollIntoView().clear().type(data.email);
      cy.log(`✓ מולא אימייל: ${data.email}`);
      cy.wait(500);
    }
    
    // Password
    if (data.password) {
      this.password1Field.scrollIntoView().clear().type(data.password);
      cy.log('✓ מולא סיסמא: ****');
      cy.wait(500);
    }
    
    // Password confirmation
    if (data.passwordConfirm) {
      this.password2Field.scrollIntoView().clear().type(data.passwordConfirm);
      cy.log('✓ מולא סיסמא בשנית: ****');
      cy.wait(500);
    }
    
    // First name
    if (data.firstName) {
      this.firstNameField.scrollIntoView().clear().type(data.firstName);
      cy.log(`✓ מולא שם פרטי: ${data.firstName}`);
      cy.wait(500);
    }
    
    // Last name
    if (data.lastName) {
      this.lastNameField.scrollIntoView().clear().type(data.lastName);
      cy.log(`✓ מולא שם משפחה: ${data.lastName}`);
      cy.wait(500);
    }
    
    // City - using force to bypass Select2 overlay
    if (data.city) {
      this.citySelect.scrollIntoView().select(data.city, { force: true });
      cy.log(`✓ נבחרה עיר: ${data.city}`);
      cy.wait(3000); // המתנה לאחר בחירת עיר - שדה הרחוב מתעדכן
    }
    
    // Street - צריך להמתין שהשדה יהיה זמין לאחר בחירת העיר
    if (data.street) {
      cy.wait(1000); // המתנה נוספת לפני מילוי הרחוב
      this.streetField.scrollIntoView().should('be.visible').clear({ force: true }).type(data.street, { force: true, delay: 100 });
      cy.log(`✓ מולא רחוב: ${data.street}`);
      cy.wait(2000); // המתנה שתפריט ההשלמה יופיע
      
      // סגירת תפריט ההשלמה האוטומטי - לחיצה על ESC או קליק במקום אחר
      cy.get('body').type('{esc}'); // סגירת תפריט autocomplete
      cy.wait(500);
      
      // לחלופין - לחיצה על כותרת הדף כדי לסגור את התפריט
      cy.get('h1, h2').first().click({ force: true });
      cy.wait(500);
    }
    
    // House number
    if (data.houseNumber) {
      cy.wait(500); // המתנה נוספת שהתפריט באמת ייסגר
      this.houseNumberField.scrollIntoView().clear({ force: true }).type(data.houseNumber, { force: true });
      cy.log(`✓ מולא מספר בית: ${data.houseNumber}`);
      cy.wait(500);
    }
    
    // Entrance
    if (data.entrance) {
      this.entranceField.scrollIntoView().clear().type(data.entrance);
      cy.log(`✓ מולא כניסה: ${data.entrance}`);
      cy.wait(500);
    }
    
    // Apartment
    if (data.apartment) {
      this.apartmentField.scrollIntoView().clear().type(data.apartment);
      cy.log(`✓ מולא דירה: ${data.apartment}`);
      cy.wait(500);
    }
    
    // Phone 1
    if (data.phone1) {
      this.phone1Field.scrollIntoView().clear().type(data.phone1);
      cy.log(`✓ מולא טלפון נייד: ${data.phone1}`);
      cy.wait(500);
    }
    
    // Phone 2
    if (data.phone2) {
      this.phone2Field.scrollIntoView().clear({ force: true }).type(data.phone2, { force: true });
      cy.log(`✓ מולא טלפון נוסף: ${data.phone2}`);
      cy.wait(500);
    }
    
    cy.log("\n=== סיים למלא את כל השדות ===");
    cy.wait(1000); // המתנה לפני המעבר לצ'קבוקסים
    
    // Checkboxes
    cy.log("\n=== מסמן צ׳קבוקסים ===");
    cy.scrollTo("bottom");
    cy.wait(1000);
    
    this.contactListCheckbox.click({ force: true });
    cy.log("✓ אושר: הצטרפות לרשימת תפוצה");
    cy.wait(400);
    
    this.termsCheckbox.click({ force: true });
    cy.log("✓ אושר: תנאי שימוש");
    cy.wait(400);
  }

  submit() {
    cy.log("=== לוחץ על כפתור הרשמה ===");
    this.submitButton.scrollIntoView().click({ force: true });
    cy.log("✓ לחץ על כפתור ההרשמה");
    cy.wait(2000);
  }

  navigateToRegistrationFromHome() {
    cy.log("=== מחפש כפתור הרשם ===");
    
    // Click on login/register dropdown
    cy.contains("span", "התחבר/הרשם").parent().scrollIntoView().click();
    cy.wait(2000);
    cy.log("✓ התפריט נפתח");
    
    // Click on Register link
    cy.get("a[href=\"Register\"], a[href*=\"Register\"]").first().click();
    cy.wait(3000);
    cy.log("✓ לחץ על כפתור הרשמה");
    
    // Verify we are on registration page
    cy.url().should("include", "Register");
  }
}

export default RegistrationPage;
