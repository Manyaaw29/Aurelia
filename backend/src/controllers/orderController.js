const Order = require("../models/Order");
const User = require("../models/User");

function generateOrderId() {
  return "AU-" + Math.floor(100000 + Math.random() * 900000);
}

exports.placeOrder = async (req, res) => {
  const user = await User.findById(req.session.userId).populate("cart.product");

  if (!user || user.cart.length === 0)
    return res.status(400).send("Cart is empty");

  const items = user.cart.map(item => ({
    product: item.product._id,
    qty: item.qty,
    price: item.product.price
  }));

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order = await Order.create({
    user: user._id,
    orderId: generateOrderId(),
    items,
    totalAmount: total,
    paymentMethod: req.body.paymentMethod || "cod",
    shippingAddress: req.body.shippingAddress,
    status: "Processing"
  });

  user.cart = [];
  await user.save();

  res.redirect("/orders/" + order._id);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.session.userId })
    .populate("items.product")
    .lean();

  res.render("pages/myorder", { orders });
};
