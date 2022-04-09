const Book = require("../models/BookModel");
const CategoryModel = require("../models/CategoryModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Category = require("../models/CategoryModel");
const BookController = {
  getAllBook: async (req, res, next) => {
    try {
      const book = await Book.find({}).populate("categorybook");
      const category = await Category.find({});
      if (req.cookies.role === "0" || !req.cookies.role) {
        res.render("userLayout/main", {
          body: "components/product/listProduct",
          books: book,
          categories: category,
          category: category,
        });
      } else {
        res.render("adminLayout/main", {
          body: "components/product/list",
          books: book,
          role: req.cookies.role,
        });
        // res.status(200).json({book})
      }
    } catch (error) {
      res.redirect("/error");
      // return res.status(500).json({
      //   error: error.message,
      // });
    }
  },

  getBookbyId: async (req, res, next) => {
    const book = await Book.findById(req.params.id).populate("categorybook");
    const books = await Book.find({});
    const category = await CategoryModel.find({});
    if (req.cookies.role === "0" || !req.cookies.role) {
      res.render("userLayout/main", {
        body: "components/product/detailProduct",
        book,
        books,
        category: category,
      });
    } else {
      res.render("adminLayout/main", {
        body: "components/product/edit",
        book,
        category,
      });
    }
  },

  createBook: async (req, res, next) => {
    const urls = [];
    const urls_invole = [];
    const url_invole_send = [];
    const files_invole = req.files.img_invole;
    const files = req.files.img;
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinary.uploader.upload(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    for (const file of files_invole) {
      const { path } = file;
      const newPath = await cloudinary.uploader.upload(path);
      urls_invole.push(newPath);
      fs.unlinkSync(path);
    }
    // res.status(200).json({ data: urls[0]['url'] });

    urls_invole.forEach((url) => {
      url_invole_send.push(url["url"]);
    });

    const {
      name,
      author,
      categorybook,
      quantity,
      price_buy,
      img,
      img_invole,
      price_rent,
      title,
      description,
    } = req.body;

    if (
      !name ||
      !author ||
      !categorybook ||
      !quantity ||
      !price_buy ||
      !title
    ) {
      return res.status(500).json({
        success: false,
        message: "Please enter all fill",
      });
    } else {
      if (quantity < 0 || price_buy < 0 || price_rent < 0) {
        return res.status(500).json({
          success: false,
          message: "Please enter number > 0",
        });
      } else {
        const book = new Book({
          name,
          author,
          categorybook,
          quantity,
          price_buy,
          img: urls[0]["url"],
          img_invole: url_invole_send,
          price_rent,
          title,
          description,
        });
        book.save();
        res.redirect("/coffee");
      }
    }
  },

  getBookbyName: async (req, res, next) => {
    console.log(req.query);
    const nameBook = req.query.nameBook.toLowerCase();
    const book = await Book.find({ name: { $regex: nameBook } });
    console.log("book", book);

    const categories = await Category.find({});
    if (book.length > 0) {
      if (req.cookies.role === "0" || !req.cookies.role) {
        res.render("userLayout/main", {
          body: "components/product/listProduct",
          books: book,
          categories,
          category: categories,
        });
      }
    } else {
      res.render("userLayout/main", {
        body: "components/product/listProductNull",
        books: book,
        categories,
        category: categories,
      });
    }
  },
  editBook: async (req, res, next) => {
    const urls = [];
    const urls_invole = [];
    const url_invole_send = [];
    const files_invole = req.files.img_invole;
    console.log({ data: files_invole });
    const files = req.files.img;

    // return
    if (req.files.img_invole) {
      console.log(req.files.img_invole)

      for (const file of files_invole) {
        const { path } = file;
        const newPath = await cloudinary.uploader.upload(path);
        urls_invole.push(newPath);
        fs.unlinkSync(path);
      }
    

    }
    if(req.files.img){
      for (const file of files) {
        const { path } = file;
        const newPath = await cloudinary.uploader.upload(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
    }
    console.log("url",urls)

    urls_invole.forEach((url) => {
      url_invole_send.push(url["url"]);
    });

    // res.status(200).json({ data: urls[0]['url'] });

   
    console.log(url_invole_send);
    const {
      name,
      author,
      categorybook,
      quantity,
      price_buy,
      image,
      img_involes,
      price_rent,
      title,
      description,
      feedback,
    } = req.body;
    try {
      let img_involess = [];
      console.log(img_involes);
      img_involess = img_involes.split(",");
      console.log("Arnh lien quan", img_involess);
      const book = await Book.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          name,
          author,
          categorybook,
          quantity,
          price_buy,
          img: req.files.img ? urls[0]["url"] : image,
          img_invole: req.files.img_invole ? url_invole_send : img_involess,
          price_rent,
          title,
          description,
        },
        {
          new: true,
        }
      );
      res.redirect("/coffee");
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  },

  // addFeedback: async (req, res, next) => {
  //   const feedback = req.body;
  //   const id = req.params.id;
  //   const book = await Book.findOne({ _id: id });
  //   if (!book) {
  //     res.status(500).json({ message: "Book is not exist" });
  //   } else {
  //     await Book.updateOne({ _id: id }, { $push: { feedback } });
  //   }
  // },

  deleteBook: async (req, res, next) => {
    const id = req.params.id;
    try {
      const book = await Book.findByIdAndDelete(id);
      res.redirect("/book");
    } catch (error) {
      res.redirect("/error");
    }
  },
};

module.exports = BookController;
