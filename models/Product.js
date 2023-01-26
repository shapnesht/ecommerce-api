const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a Product name"],
      maxlength: [100, "name can't be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide Product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide Product description"],
      maxlength: [1000, "description should not be more than 1000 characters"],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dazetdalt/image/upload/v1674153951/file-upload/tmp-4-1674153939424_cla2z9.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide Product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide Product company"],
      enum: {
        values: ["ikea", "shop", "ashu"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre("remove", async function () {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
