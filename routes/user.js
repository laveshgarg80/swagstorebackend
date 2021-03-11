const express = require("express");
const router = express.Router();

const {getUserById , getUser ,updateUser , userPurchaseList} = require("../controllers/user");
const {isAdmin ,isAuthenticated ,isSignedIn} = require("../controllers/auth");


router.param("userId" ,getUserById );
router.get("/user/:userId" ,isSignedIn ,isAuthenticated, getUser); //isSignedIn ,isAuthenticated are the middle wares and they can be fitted anywhere between the parameters
// router.get("/users",getAllUser); only assignment
router.put("/user/:userId" , isSignedIn, isAuthenticated , updateUser);
router.get("/orders/user/:userId" , isSignedIn, isAuthenticated , userPurchaseList);


module.exports = router;