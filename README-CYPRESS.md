# LastPrice Cypress Automation Tests

פרויקט זה מכיל טסטים אוטומטיים לאתר LastPrice באמצעות Cypress.

## 📁 מבנה הפרויקט

```
cypress/
├── e2e/                          # קבצי הטסטים
│   ├── registration.cy.js        # טסטי הרשמה
│   ├── cart.cy.js                # טסטי עגלת קניות
│   └── additional-tests.cy.js    # טסטים נוספים (חיפוש, נגישות, תוכן דינמי)
├── support/
│   ├── pages/                    # Page Objects
│   │   ├── HomePage.js
│   │   ├── RegistrationPage.js
│   │   ├── CartPage.js
│   │   ├── ProductPage.js
│   │   └── CategoryPage.js
│   ├── commands.js               # פקודות מותאמות אישית
│   └── e2e.js                    # הגדרות Cypress
├── cypress.config.js             # קובץ הגדרות ראשי
└── package.json                  # תלויות הפרויקט
```

## 🚀 התקנה והרצה

### התקנת תלויות (פעם אחת)
```bash
npm install
```

### הרצת הטסטים

#### 1. פתיחת Cypress UI (מומלץ לפיתוח)
```bash
npm run cy:open
```
לחץ על הטסט שתרצה להריץ מתוך הממשק הגרפי.

#### 2. הרצת כל הטסטים ב-Headless Mode
```bash
npm test
```
או
```bash
npm run cy:run
```

#### 3. הרצה עם Chrome (Headed Mode)
```bash
npm run cy:run:chrome
```

#### 4. הרצה עם ראש גלוי
```bash
npm run cy:run:headed
```

## 📝 הטסטים

### טסטי הרשמה (`registration.cy.js`)
1. **הרשמה מוצלחת** - מילוי טופס הרשמה עם כל הפרטים הנדרשים
2. **אימייל כפול** - בדיקה שהמערכת מונעת רישום עם אימייל קיים
3. **שדות חובה** - בדיקה שהמערכת מונעת שליחה עם שדות חובה ריקים
4. **אימות טלפון** - בדיקה שהמערכת מונעת שליחה עם טלפון לא תקין

### טסטי עגלת קניות (`cart.cy.js`)
- **הוספת מוצרים מ-3 קטגוריות** - הוספת מוצרים מקטגוריות שונות ואימות בעגלה

### טסטים נוספים (`additional-tests.cy.js`)
- **טסטי חיפוש** - בדיקת פונקציונליות החיפוש
- **טסטי נגישות** - בדיקות נגישות בסיסיות (alt texts, ניגודיות)
- **טסטי תוכן דינמי** - בדיקת טעינת תוכן דינמי וסינון

## 📊 תוצאות הטסטים

- **Screenshots**: `output/screenshots/`
- **Videos**: `output/videos/`

Cypress יוצר אוטומטית צילומי מסך כאשר טסט נכשל וסרטונים של כל הרצת הטסטים.

## 🔧 הגדרות

ניתן לשנות הגדרות ב-`cypress.config.js`:
- `baseUrl`: כתובת האתר לבדיקה
- `viewportWidth/Height`: גודל החלון
- `defaultCommandTimeout`: זמן המתנה לפקודות
- נתיבי screenshots ו-videos

## 📌 הערות חשובות

1. **אימיילים ייחודיים**: הטסטים יוצרים אימיילים ייחודיים עם timestamp כדי למנוע התנגשויות
2. **המתנות**: יש המתנות בין פעולות כדי לתת לדף להטען
3. **ניקוי עוגיות**: לפני כל טסט מתבצע ניקוי של עוגיות ו-localStorage

## 🆚 הבדלים מ-Selenium

- **סינטקס פשוט יותר**: Cypress משתמש ב-JavaScript עם API אינטואיטיבי
- **אין צורך ב-WebDriver**: Cypress רץ בתוך הדפדפן
- **טעינה אוטומטית**: Cypress ממתין אוטומטית לאלמנטים
- **דיבאגינג קל יותר**: ממשק גרפי מצוין עם Time Travel
- **צילומי מסך וסרטונים**: נוצרים אוטומטית

## 📚 מקורות נוספים

- [Cypress Documentation](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API](https://docs.cypress.io/api/table-of-contents)

---

**נוצר על ידי המרה מפרויקט Selenium/Java לפרויקט Cypress/JavaScript** 🚀
