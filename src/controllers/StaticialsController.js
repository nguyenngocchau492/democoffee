const Staticials = require("../models/StaticialsModel");
const StaticialController = {
  getAllStaticial: async (req, res, next) => {
    try {
      const staticial = await Staticials.find();
      return res.status(200).json(staticial);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  getStaticialbyId: async (req, res, next) => {
    const staticial = await Staticials.findById(req.params.id);
    return res.status(200).json(user);
  },

  createStaticial: async (req, res, next) => {
    const { total_price, total_number, date, number_book } = req.body;
    if (!total_price || !total_number || !date || !number_book) {
      return res.status(500).json({
        success: false,
        message: "Please enter all fill",
      });
    } else {
      const staticial = new Staticials({
        total_price,
        total_number,
        date,
        number_book,
      });
      staticial.save();
      return res.status(200).json({ success: true, message: "Create success" });
    }
  },

  editStaticial: async (req, res, next) => {
    const { total_price, total_number, date, number_book } = req.body;
    try {
      const staticial = await Staticials.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          total_price,
          total_number,
          date,
          number_book,
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

  deleteStaticial: async (req, res, next) => {
    const id = req.params.id;
    try {
      const staticial = await Staticials.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Delete success" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = StaticialController;
