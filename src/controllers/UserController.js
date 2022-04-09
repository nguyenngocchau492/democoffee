const User = require("../models/UserModels");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const CategoryModel = require("../models/CategoryModel")
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
const UserController = {
  changePassword: async (req, res) => {
    try {
      const { password, newPass, reNewPass } = req.body;
      if (password.trim() === "") {
        return res.render("userLayout/components/changePass", {
          message: "Please enter password",
        });
      }
      if (newPass !== reNewPass) {
        return res.render("userLayout/components/changePass", {
          message: "Repeat password incorrect",
        });
      }
      const user = await User.findOne({ _id: req.cookies.id });
      const isMatch = await bcrypt.compare(password, user.password);
      const newHashPass = await bcrypt.hash(newPass, 12);
      if (isMatch) {
        await User.findOneAndUpdate(
          { _id: req.cookies.id },
          { password: newHashPass }
        );
        res.redirect("/");
      } else {
        res.render("userLayout/components/changePass", {
          message: "Old password is incorrect",
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  logOut: async (req, res) => {
    res.clearCookie("id");
    res.clearCookie("name");
    res.clearCookie("phone");
    res.clearCookie("role");
    res.clearCookie("avatar");
    res.clearCookie("address");
    res.clearCookie("email");
    res.redirect("/user/login");
  },

  getAllUser: async (req, res, next) => {
    if (req.cookies) {
      if (req.cookies.role === "1") {
        try {
          const users = await User.find({ role: { $ne: 1  } });

          return res.render("adminLayout/main", {
            body: "components/user/list",
            users,
            role: req.cookies.role
          });
        } catch (error) {
          return res.status(500).json({
            error: error.message,
          });
        }
      }
    }
    res.redirect("/error");
  },
  addMoney: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      const role = Number.parseInt(req.body.role);
      if (user) {
        await User.findOneAndUpdate(
          { _id: req.params.id },
          { role }
        );
        return res.redirect("/user");
      } else {
        return res.status(500).json({ success: false });
      }
    } catch (error) {
      return res.status(500).json({ err: error.message });
    }
  },

  getUserbyId: async (req, res, next) => {
    const category = CategoryModel.find({})
    const user = await User.findById(req.params.id);
    if (req.cookies === "0") {
      res.render("userLayout/main", {
        body: "components/profile",
        user,
        category:category,
      });
    } else {
      res.render("adminLayout/main", {
        body: "components/user/edit",
        user,
      });
    }
  },

  register: async (req, res, next) => {
    const image = await cloudinary.uploader.upload(req.file.path);

    console.log({ data: req.body });
    const { email, password, name, address, phone, account_balance } = req.body;
    if (!email || !password || !name || !address || !phone) {
      res.render("authLayout/register", { message: "Please enter all fill" });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        res.render("authLayout/register", {
          message: "This email already exists.",
        });
      }
      if (password.length < 6) {
        res.render("authLayout/register", {
          message: "Password must be at least 6 characters.",
        });
      }
      if (!validateEmail(email)) {
        res.render("authLayout/register", { message: "Invalid emails." });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: passwordHash,
        name,
        address,
        phone,
        avatar: image.url,
        account_balance,
      });

      newUser.save();
      return res.redirect("./login");
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (email.trim() === "" || password.trim() === "") {
        res.render("authLayout/login", { message: "Please enter all field." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.render("authLayout/login", {
          message: "This email does not exist.",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        res.render("authLayout/login", {
          message: "Password is incorrect.",
        });

      res.clearCookie("id");
      res.clearCookie("name");
      res.clearCookie("phone");
      res.clearCookie("role");
      res.clearCookie("avatar");
      res.clearCookie("address");
      res.clearCookie("email");
      const setMultipleCookies = (res) => {
        res.cookie("name", user.name, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
        res.cookie("phone", user.phone, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
        res.cookie("address", user.address, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
        res.cookie("avatar", `${user.avatar}`, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
        res.cookie("email", user.email, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });

        res.cookie("role", user.role, {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
        res.cookie("id", user._id.toString(), {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
      };
      setMultipleCookies(res);

      res.redirect("/");
      // return res.status(200).send("Cookie has been set");
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  editUser: async (req, res, next) => {
    const { name, address, phone, avatar, account_balance, role } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          name,
          address,
          phone,
          avatar,
          account_balance,
          role,
        },
        {
          new: true,
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Update Success!!!?" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  deleteUser: async (req, res, next) => {
    const id = req.params.id;
    try {
      const user = await User.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Delete success" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = UserController;
