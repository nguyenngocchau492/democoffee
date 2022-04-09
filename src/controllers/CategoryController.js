const Category = require("../models/CategoryModel");
const cloudinary = require("../config/cloudinary")
const CategoryController = {
  getAllCategory: async (req, res, next) => {
    try {
      const category = await Category.find({});
      if(req.cookies.role==='1'|| req.cookies.role ==='2'){
        res.render("adminLayout/main", {
          body: "components/category/list",
         categories: category,
         role: req.cookies.role
        })
      }else{
        res.redirect("/error")
      }
    
   
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  getCategorybyId: async (req, res, next) => {

   
    
    const category = await Category.findById(req.params.id);
    if(req.cookies.role==='1' || req.cookies.role==='2'){
      res.render("adminLayout/main", {
        body: "components/category/edit",
       category: category
      })
    }else {
      res.redirect("/error")
    }
  },

  // create category
  createCategory: async (req, res, next) => {
    
    const { name, title } = req.body;
  
    const image = await cloudinary.uploader.upload(req.file.path)
    if (!name || !title) {
      res.redirect("/category")
    } else {
      const category = new Category({
        name,
        title,
        iconcategory: image.url,
      });
      category.save();
     res.redirect("/category")
    }
  },

  editCategory: async (req, res, next) => {
    let categoryicon
    
if(req.file){
  categoryicon = await cloudinary.uploader.upload(req.file.path)
  console.log({cate: categoryicon.url})
}
else {
categoryicon = req.body.iconcategory
 console.log(categoryicon)
}
    const { name, title } = req.body;
    
   
    try {
    await Category.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          name,
          title ,
          iconcategory: req.file ? categoryicon.url: categoryicon
        },
        {
          new: true,
        }
      );
     res.redirect("/category")
    } catch (error) {
      console.log({error})
      res.redirect("/error")
    }
  },

  deleteCategory: async (req, res, next) => {
    const id = req.params.id;
    try {
  const category =  await Category.findByIdAndDelete(id);
 if(category){
   return res.status(200).json({success: true})
 }else {
  return res.status(500).json({success: false})
 }
    } catch (error) {
      res.redirect("/error")
    }
  },
};

module.exports = CategoryController;
