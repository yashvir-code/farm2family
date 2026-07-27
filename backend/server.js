const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const farmerRoutes = require("./routes/farmer");
const customerRoutes = require("./routes/customer");
const listingRoutes = require("./routes/listing");
const fetchRoutes = require("./routes/fetch");
const orderRoutes = require("./routes/orders");
const membershipRoutes =  require("./routes/membership");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/farmer", farmerRoutes);
app.use("/customer", customerRoutes);
app.use("/listing", listingRoutes);
app.use("/fetch", fetchRoutes);
app.use("/orders",orderRoutes);
app.use("/membership",membershipRoutes);
app.use("/admin", adminRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});