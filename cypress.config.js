const { defineConfig } = require('cypress')
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.lastprice.co.il',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: false,
    screenshotOnRunFailure: false,
    screenshotsFolder: 'output/screenshots',
    videosFolder: 'output/videos',
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    setupNodeEvents(on, config) {
      // משתנה גלובלי לשמירת נתוני הטסטים
      const testData = {
        registrationTests: [],
        accessibilityTests: [],
        cartTests: [],
        searchTests: []
      };

      // הוספת נתוני טסט
      on('task', {
        addRegistrationTest(data) {
          testData.registrationTests.push(data);
          return null;
        },
        addCartTest(data) {
          testData.cartTests.push(data);
          return null;
        },
        clearCartTests() {
          testData.cartTests = [];
          console.log('✅ נתוני בדיקות העגלה נוקו');
          return null;
        },
        updateCartTestQuantity(data) {
          // מחיקת הרשומה הישנה של המוצר
          const productIndex = testData.cartTests.findIndex(
            item => item['Product Name'] && item['Product Name'].includes(data.productNameMatch)
          );
          
          if (productIndex !== -1) {
            testData.cartTests.splice(productIndex, 1);
            console.log(`✅ עדכון כמות עבור ${data.productNameMatch}`);
          }
          
          // הוספת הרשומה החדשה
          testData.cartTests.push({
            'Category': data.Category,
            'Product Name': data['Product Name'],
            'Qty Expected': data['Qty Expected'],
            'Qty Actual': data['Qty Actual'],
            'Unit Price Expected': data['Unit Price Expected'],
            'Unit Price Actual': data['Unit Price Actual'],
            'Total Expected': data['Total Expected'],
            'Total Actual': data['Total Actual'],
            'Status': data.Status
          });
          
          return null;
        },
        addAccessibilityTest(data) {
          testData.accessibilityTests.push(data);
          return null;
        },
        addSearchTest(data) {
          testData.searchTests.push(data);
          return null;
        },
        generateExcel(fileName) {
          // בדיקה אם יש נתונים
          const hasData = testData.registrationTests.length > 0 ||
                         testData.accessibilityTests.length > 0 ||
                         testData.cartTests.length > 0 ||
                         testData.searchTests.length > 0;

          if (!hasData) {
            console.log('⚠️ אין נתונים ליצירת קובץ אקסל - מדלג');
            return null;
          }

          const workbook = XLSX.utils.book_new();

          // גיליון 1: בדיקות הרשמה
          if (testData.registrationTests.length > 0) {
            const ws1 = XLSX.utils.json_to_sheet(testData.registrationTests);
            XLSX.utils.book_append_sheet(workbook, ws1, 'RegistrationTests');
          }

          // גיליון 2: בדיקות נגישות
          if (testData.accessibilityTests.length > 0) {
            const ws2 = XLSX.utils.json_to_sheet(testData.accessibilityTests);
            XLSX.utils.book_append_sheet(workbook, ws2, 'AccessibilityTests');
          }

          // גיליון 3: בדיקות עגלה
          if (testData.cartTests.length > 0) {
            const ws3 = XLSX.utils.json_to_sheet(testData.cartTests);
            
            // הוספת שורת סיכום
            const totalExpected = testData.cartTests.reduce((sum, item) => sum + (parseFloat(item['Total Expected']) || 0), 0);
            const totalActual = testData.cartTests.reduce((sum, item) => sum + (parseFloat(item['Total Actual']) || 0), 0);
            
            XLSX.utils.sheet_add_json(ws3, [
              {
                'Category': 'TOTAL',
                'Product Name': '',
                'Qty Expected': '',
                'Qty Actual': '',
                'Unit Price Expected': '',
                'Unit Price Actual': '',
                'Total Expected': totalExpected.toFixed(2),
                'Total Actual': totalActual.toFixed(2),
                'Status': totalExpected === totalActual ? 'PASS ✓' : 'FAIL ✗'
              }
            ], { origin: -1, skipHeader: true });
            
            XLSX.utils.book_append_sheet(workbook, ws3, 'CartTests');
          }

          // גיליון 4: בדיקות חיפוש
          if (testData.searchTests.length > 0) {
            const ws4 = XLSX.utils.json_to_sheet(testData.searchTests);
            XLSX.utils.book_append_sheet(workbook, ws4, 'SearchAndFilterTests');
          }

          // שמירת הקובץ
          const outputDir = path.join(process.cwd(), 'output');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const outputPath = path.join(outputDir, fileName);
          XLSX.writeFile(workbook, outputPath);
          console.log(`\n✅ קובץ אקסל נוצר בהצלחה: ${outputPath}`);
          
          // איפוס הנתונים
          testData.registrationTests = [];
          testData.accessibilityTests = [];
          testData.cartTests = [];
          testData.searchTests = [];
          
          return outputPath;
        }
      });

      return config;
    },
  },
})
