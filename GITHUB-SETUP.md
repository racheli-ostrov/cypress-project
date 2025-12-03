# הוראות להעלאת הפרויקט לגיטהאב 🚀

## שלב 1: צור רפוזיטורי חדש בגיטהאב

1. היכנסי ל-GitHub.com
2. לחצי על ה-`+` בפינה הימנית העליונה
3. בחרי **New repository**
4. תני שם לרפוזיטורי: `lastprice-cypress-tests` (או כל שם אחר שתרצי)
5. **אל תסמני** את האופציות:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. לחצי על **Create repository**

## שלב 2: חברי את הפרויקט המקומי לגיטהאב

לאחר יצירת הרפוזיטורי, GitHub יראה לך עמוד עם הוראות.
**העתיקי את כתובת ה-HTTPS של הרפוזיטורי** (משהו כמו: `https://github.com/YourUsername/lastprice-cypress-tests.git`)

ואז הריצי את הפקודות הבאות:

```bash
# הוספת ה-remote
git remote add origin https://github.com/YourUsername/lastprice-cypress-tests.git

# שינוי שם ה-branch ל-main (אם צריך)
git branch -M main

# העלאת הקוד לגיטהאב
git push -u origin main
```

## שלב 3: וודאי שהכל הועלה

1. רעננ/י את עמוד GitHub ברצה - אמורות לראות את כל הקבצים!
2. הקבצים שהועלו:
   - ✅ `package.json`
   - ✅ `cypress.config.js`
   - ✅ `README-CYPRESS.md`
   - ✅ תיקיית `cypress/` עם כל הטסטים
   - ✅ `.gitignore`

## 📝 הערות חשובות

- **הפרויקט הישן (Java/Selenium)** לא מחובר יותר - זה פרויקט חדש לגמרי!
- רק קבצי Cypress הועלו, ללא קבצי Java הישנים (target/, src/, pom.xml וכו')
- הקבצים הבאים **לא** יועלו (לפי .gitignore):
  - `node_modules/`
  - `output/videos/`
  - `output/screenshots/`
  - `target/`

## 🔄 פקודות Git שימושיות לעתיד

```bash
# בדיקת סטטוס
git status

# הוספת קבצים חדשים
git add .

# יצירת commit
git commit -m "תיאור השינויים"

# העלאה לגיטהאב
git push

# משיכת שינויים מגיטהאב
git pull
```

---

**זהו! הפרויקט שלך עכשיו עצמאי ומנותק לגמרי מהפרויקט הישן.** 🎉
