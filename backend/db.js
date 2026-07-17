const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "farm2family"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database Connected");
    }
});

module.exports = connection;