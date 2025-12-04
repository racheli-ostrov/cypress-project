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

          // ✅ גיליון 1: RegistrationTests (בדיקות הרשמה)
          // עמודות: Test ID, Description, Input Data, Expected, Actual, Status
          if (testData.registrationTests.length > 0) {
            const registrationData = testData.registrationTests.map(item => ({
              'Test ID': item['Test ID'] || item.testId,
              'Description': item['Description'] || item.description,
              'Input Data': item['Input Data'] || item.inputData,
              'Expected': item['Expected'] || item.expected,
              'Actual': item['Actual'] || item.actual,
              'Status': item['Status'] || item.status
            }));
            const ws1 = XLSX.utils.json_to_sheet(registrationData);
            XLSX.utils.book_append_sheet(workbook, ws1, 'RegistrationTests');
          }

          // ✅ גיליון 2: AccessibilityTests (בדיקות נגישות)
          // עמודות: Test ID, Mode, Action, Expected Change, Actual Change, Status, Screenshot Path
          if (testData.accessibilityTests.length > 0) {
            const accessibilityData = testData.accessibilityTests.map(item => ({
              'Test ID': item['Test ID'] || item.testId,
              'Mode': item['Mode'] || item.mode,
              'Action': item['Action'] || item.action,
              'Expected Change': item['Expected Change'] || item.expectedChange,
              'Actual Change': item['Actual Change'] || item.actualChange,
              'Status': item['Status'] || item.status,
              'Screenshot Path': item['Screenshot Path'] || item.screenshotPath || ''
            }));
            const ws2 = XLSX.utils.json_to_sheet(accessibilityData);
            XLSX.utils.book_append_sheet(workbook, ws2, 'AccessibilityTests');
          }

          // ⭐ גיליון 3: CartTests (בדיקות עגלה)
          // עמודות: Category, Product Name, Qty Expected, Qty Actual, Unit Price Expected, Unit Price Actual, Total Expected, Total Actual, Status
          if (testData.cartTests.length > 0) {
            const cartData = testData.cartTests.map(item => ({
              'Category': item['Category'] || item.category,
              'Product Name': item['Product Name'] || item.productName,
              'Qty Expected': item['Qty Expected'] || item.qtyExpected,
              'Qty Actual': item['Qty Actual'] || item.qtyActual,
              'Unit Price Expected': item['Unit Price Expected'] || item.unitPriceExpected,
              'Unit Price Actual': item['Unit Price Actual'] || item.unitPriceActual,
              'Total Expected': item['Total Expected'] || item.totalExpected,
              'Total Actual': item['Total Actual'] || item.totalActual,
              'Status': item['Status'] || item.status
            }));
            
            const ws3 = XLSX.utils.json_to_sheet(cartData);
            
            // הוספת שורת סיכום
            const totalExpected = testData.cartTests.reduce((sum, item) => sum + (parseFloat(item['Total Expected']) || 0), 0);
            const totalActual = testData.cartTests.reduce((sum, item) => sum + (parseFloat(item['Total Actual']) || 0), 0);
            
            XLSX.utils.sheet_add_json(ws3, [
              {
                'Category': 'TOTAL CART',
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

          // ✅ גיליון 4: SearchAndFilterTests (בדיקות חיפוש וסינון)
          // עמודות: Step, Action, Expected Result, Actual Result, Status, Screenshot Path
          if (testData.searchTests.length > 0) {
            const searchData = testData.searchTests.map(item => ({
              'Step': item['Step'] || item.step,
              'Action': item['Action'] || item.action,
              'Expected Result': item['Expected Result'] || item.expectedResult,
              'Actual Result': item['Actual Result'] || item.actualResult,
              'Status': item['Status'] || item.status,
              'Screenshot Path': item['Screenshot Path'] || item.screenshotPath || ''
            }));
            const ws4 = XLSX.utils.json_to_sheet(searchData);
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
