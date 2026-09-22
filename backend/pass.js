const bcrypt = require("bcrypt");

const password = "admin@0000";

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error("Password hashing failed:", err);
        return;
    }

    console.log("Original Password:", password);
    console.log("Bcrypt Hash:", hash);
});