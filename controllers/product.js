const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");    // fs means file system(for browsing)

exports.getProductById = (req,res,next,id) => {
   Product.findById(id).populate("category").exec((err,product) => {
       if(err){
           return res.status(400).json({
               error: "Product Not Found"
           })
       }
       req.product = product;
       next();
   })
}

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req , (err,fields,file) => {
        if(err){
             return res.status(400).json({
                 error: "Problem With The Image"
             })           
        }

        //destructure the field
        const{ name, description, price, category, stock} = fields;

        if(!name ||
          !description ||
          !price ||
          !category ||
          !stock
        ){
            return res.status(400).json({
                error: "Please enter the whole fields"
            })
        }

        //restrictions on field
        let product = new Product(fields);
        //console.log(product);
        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too Big"
                })
            }

          product.photo.data = fs.readFileSync(file.photo.path);
          product.photo.contentType = file.photo.type;
        }

        //console.log(product);
        //save to DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving tshirt in the database is failed"
                })
            }
            res.json(product);
        })
    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type" , req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

//delete controllers
exports.deleteProduct = (req,res) => {
   let product = req.product;
   product.remove((err,deleteProduct) => {
       if(err){
           return res.status(400).json({
               error: "Unable to Delete The Product"
           })
       }
       res.json({
           message: "Deletion was Successfull!!",
           deleteProduct
       })
   })
}

//update controllers
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req , (err,fields,file) => {
        if(err){
             return res.status(400).json({
                 error: "Problem With The Image"
             })           
        }

        // //destructure the field
        // const{ name, description, price, category, stock} = fields;

        // if(!name ||
        //   !description ||
        //   !price ||
        //   !category ||
        //   !stock
        // ){
        //     return res.status(400).json({
        //         error: "Please enter the whole fields"
        //     })
        // }

        //this is the updation code
        let product = req.product;
        product = _.extend(product, fields);
        //console.log(product);
        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too Big"
                })
            }

          product.photo.data = fs.readFileSync(file.photo.path);
          product.photo.contentType = file.photo.type;
        }

        //console.log(product);
        //save to DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "updation of product failed"
                })
            }
            res.json(product);
        })
    })

}

//listing controllers
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
            
   Product.find().select("-photo").populate("category").sort([[sortBy , "asc"]]).limit(limit).exec((err, products) => {
       if(err){
           return res.status(400).json({
               error: "No Product found"
           })
       }
       res.json(products);
   })   
}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,category) => {
        if(err){
            return res.status(400).json({
                error: "No Category Found"
            })
        }
        res.json(category);
    })
}

//middleware (stocks and solds)
exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count , sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,{},(err,products) => {
      if(err){
          return res.status(400).json({
              error: "Bulk Operations Failed"
          })
      }
      next();       
    })
}