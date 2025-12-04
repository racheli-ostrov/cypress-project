const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelReporter {
  constructor() {
    this.registrationTests = [];
    this.accessibilityTests = [];
    this.cartTests = [];
    this.searchTests = [];
  }

  // ✅ הוספת בדיקת הרשמה
  addRegistrationTest(data) {
    this.registrationTests.push({
      'Test ID': data.testId,
      'Description': data.description,
      'Input Data': data.inputData,
      'Expected': data.expected,
      'Actual': data.actual,
      'Status': data.status
    });
  }

  // ✅ הוספת בדיקת נגישות
  addAccessibilityTest(data) {
    this.accessibilityTests.push({
      'Test ID': data.testId,
      'Mode': data.mode,
      'Action': data.action,
      'Expected Change': data.expectedChange,
      'Actual Change': data.actualChange,
      'Status': data.status,
      'Screenshot Path': data.screenshotPath || ''
    });
  }

  // ⭐ הוספת בדיקת עגלה
  addCartTest(data) {
    this.cartTests.push({
      'Category': data.category,
      'Product Name': data.productName,
      'Qty Expected': data.qtyExpected,
      'Qty Actual': data.qtyActual,
      'Unit Price Expected': data.unitPriceExpected,
      'Unit Price Actual': data.unitPriceActual,
      'Total Expected': data.totalExpected,
      'Total Actual': data.totalActual,
      'Status': data.status
    });
  }

  // ✅ הוספת בדיקת חיפוש וסינון
  addSearchTest(data) {
    this.searchTests.push({
      'Step': data.step,
      'Action': data.action,
      'Expected Result': data.expectedResult,
      'Actual Result': data.actualResult,
      'Status': data.status,
      'Screenshot Path': data.screenshotPath || ''
    });
  }

  // יצירת קובץ אקסל
  generateExcel(fileName = 'TestResults.xlsx') {
    const workbook = XLSX.utils.book_new();

    // גיליון 1: בדיקות הרשמה
    if (this.registrationTests.length > 0) {
      const ws1 = XLSX.utils.json_to_sheet(this.registrationTests);
      XLSX.utils.book_append_sheet(workbook, ws1, 'RegistrationTests');
    }

    // גיליון 2: בדיקות נגישות
    if (this.accessibilityTests.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(this.accessibilityTests);
      XLSX.utils.book_append_sheet(workbook, ws2, 'AccessibilityTests');
    }

    // גיליון 3: בדיקות עגלה (עם חישובי סיכום)
    if (this.cartTests.length > 0) {
      const ws3 = XLSX.utils.json_to_sheet(this.cartTests);
      
      // הוספת שורת סיכום
      const lastRow = this.cartTests.length + 1;
      const totalExpected = this.cartTests.reduce((sum, item) => sum + (parseFloat(item['Total Expected']) || 0), 0);
      const totalActual = this.cartTests.reduce((sum, item) => sum + (parseFloat(item['Total Actual']) || 0), 0);
      
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

    // גיליון 4: בדיקות חיפוש וסינון
    if (this.searchTests.length > 0) {
      const ws4 = XLSX.utils.json_to_sheet(this.searchTests);
      XLSX.utils.book_append_sheet(workbook, ws4, 'SearchAndFilterTests');
    }

    // שמירת הקובץ
    const outputPath = path.join(process.cwd(), 'output', fileName);
    
    // יצירת תיקיית output אם לא קיימת
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    XLSX.writeFile(workbook, outputPath);
    console.log(`\n✅ קובץ אקסל נוצר בהצלחה: ${outputPath}`);
    
    return outputPath;
  }

  // איפוס כל הנתונים
  reset() {
    this.registrationTests = [];
    this.accessibilityTests = [];
    this.cartTests = [];
    this.searchTests = [];
  }
}

// יצירת אובייקט גלובלי
if (typeof global !== 'undefined') {
  global.excelReporter = new ExcelReporter();
}

module.exports = ExcelReporter;
