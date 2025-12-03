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
    
    // City
    if (data.city) {
      this.citySelect.scrollIntoView().select(data.city);
      cy.log(`✓ נבחרה עיר: ${data.city}`);
      cy.wait(2000); // המתנה לאחר בחירת עיר
    }
    
    // Street
    if (data.street) {
      this.streetField.scrollIntoView().clear().type(data.street);
      cy.log(`✓ מולא רחוב: ${data.street}`);
      cy.wait(2000); // המתנה לאימות הרחוב
    }
    
    // House number
    if (data.houseNumber) {
      this.houseNumberField.scrollIntoView().clear().type(data.houseNumber);
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
      this.phone2Field.scrollIntoView().clear().type(data.phone2);
      cy.log(`✓ מולא טלפון נוסף: ${data.phone2}`);
      cy.wait(500);
    }
    
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
