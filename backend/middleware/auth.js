const jwt = require("jsonwebtoken");

const SECRET_KEY = "001122";

function kavach(req, res, next) {

    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(403).json({
            message: "Invalid Token"
        });
    }

    const token = bearerHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {

        if (err) {
            return res.status(403).json({
                message: "Invalid Token"
            });
        }

        req.user = decoded;
        next();

    });

}

module.exports = kavach;