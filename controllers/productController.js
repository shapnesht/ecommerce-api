const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const addProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.find({ _id: productId });
  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Product with given id doesn't exist id : ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Product with given id doesn't exist id : ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Product with given id doesn't exist id : ${productId}`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Successfully Deleted the Product" });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomAPIError.BadRequestError("No File Uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomAPIError.BadRequestError("Please upload a valid image");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomAPIError.BadRequestError(
      "Please upload a image of size less than 1MB"
    );
  }
  const imageData = await cloudinary.uploader.upload(
    productImage.tempFilePath,
    {
      folder: "fileupload",
    }
  );
  fs.unlinkSync(productImage.tempFilePath);
  res.status(StatusCodes.OK).json({ image: imageData.secure_url });
};

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
