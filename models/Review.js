const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide the rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide the review title"],
      maxlength: [100, "Title can't exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please provide the comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log(productId);
};

ReviewSchema.post("deleteOne", async function () {
  console.log("remove");
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});


module.exports = mongoose.model("Review", ReviewSchema);
