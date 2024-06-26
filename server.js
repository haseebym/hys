const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer();

const app = express();
const PORT = 3000;
const CSV_FILE_PATH = 've.csv';

// إعداد body-parser للتعامل مع البيانات المرسلة في POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد المجلد الذي يحتوي على ملف HTML
app.use(express.static(__dirname));

// تأكد من أن ملف CSV موجود، وإذا لم يكن موجودًا، قم بإنشائه
if (!fs.existsSync(CSV_FILE_PATH)) {
    fs.writeFileSync(CSV_FILE_PATH, 'email,firstName,lastName,employeecompany,title,country,timestamp,eventtype,amount,currency\n', 'utf8');
}

// معالجة طلبات POST لإضافة بيانات إلى ملف CSV
app.post('/add-data', upload.none(), (req, res) => {
    const { email, firstName, lastName, employeecompany, title, country, timestamp, eventtype, amount, currency } = req.body;

    // تحويل البيانات إلى تنسيق CSV
    const newEntry = `${email},${firstName},${lastName},${employeecompany},${title},${country},${timestamp},${eventtype},${amount},${currency}\n`;

    // إضافة البيانات إلى ملف CSV
    fs.appendFile(CSV_FILE_PATH, newEntry, (err) => {
        if (err) {
            console.error('Error writing to CSV file', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Data added successfully');
    });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});