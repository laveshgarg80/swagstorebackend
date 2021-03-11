const express = require("express");
const router = express.Router();

const {getProductById , 
       createProduct ,
       getProduct,
       photo ,
       updateProduct ,
       deleteProduct ,
       getAllProducts,
       getAllUniqueCategories} = require("../controllers/product");
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//My Param
router.param("userId",getUserById);
router.param("productId",getProductById);

//My actual routers
//creates routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);

//read route
router.get("/product/:productId" , getProduct);
router.get("/product/photo/:productId" , photo);

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);

//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);

//listing routes
router.get("/products" , getAllProducts);
router.get("/products/categories" , getAllUniqueCategories);

module.exports = router;