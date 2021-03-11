require('dotenv').config();
const mongoose = require('mongoose');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.static(__dirname + '/'));

//My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBRoutes = require("./routes/paymentBRoutes");


//DB Connections
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("DB CONNECTED");
});

//Here app.use is a middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//My routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentBRoutes);

//port
const port = process.env.PORT|| 8000;


app.get('/', (req, res) => {
	res.send('hellos...');
});
//Listener Port is Running
app.listen(port , () => {
    console.log(`App is running at port ${port}`);
});

















