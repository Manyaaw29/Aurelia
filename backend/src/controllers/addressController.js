const User = require("../models/User");

// 📌 Load all addresses (Account → Address page)
exports.getAddresses = async (req, res) => {
  const user = await User.findById(req.session.userId).lean();
  res.render("pages/address", {
    addresses: user.addresses,
  });
};

// 📌 Add new address
exports.addAddress = async (req, res) => {
  const {
    type,
    name,
    line1,
    line2,
    city,
    state,
    zip,
    phone,
    isDefault
  } = req.body;

  const user = await User.findById(req.session.userId);

  // If new address is default, unset old default ones
  if (isDefault === "on") {
    user.addresses.forEach(addr => (addr.isDefault = false));
  }

  user.addresses.push({
    type,
    name,
    line1,
    line2,
    city,
    state,
    zip,
    phone,
    isDefault: isDefault === "on"
  });

  await user.save();
  res.redirect("/address");
};

// 📌 Update existing address
exports.updateAddress = async (req, res) => {
  const { id } = req.params;

  const {
    type,
    name,
    line1,
    line2,
    city,
    state,
    zip,
    phone,
    isDefault
  } = req.body;

  const user = await User.findById(req.session.userId);

  // Unset previous default if selecting a new default
  if (isDefault === "on") {
    user.addresses.forEach(addr => (addr.isDefault = false));
  }

  const address = user.addresses.id(id); // Mongoose subdocument finder

  address.type = type;
  address.name = name;
  address.line1 = line1;
  address.line2 = line2;
  address.city = city;
  address.state = state;
  address.zip = zip;
  address.phone = phone;
  address.isDefault = isDefault === "on";

  await user.save();
  res.redirect("/address");
};

// 📌 Delete address
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(req.session.userId);

  user.addresses = user.addresses.filter(addr => addr._id.toString() !== id);

  await user.save();
  res.redirect("/address");
};

// 📌 Set an address as default
exports.setDefaultAddress = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(req.session.userId);

  user.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === id;
  });

  await user.save();
  res.redirect("/address");
};

// 📌 Choose address on checkout page
exports.getCheckoutAddress = async (req, res) => {
  const user = await User.findById(req.session.userId).lean();

  res.render("pages/checkout", {
    addresses: user.addresses,
    cart: user.cart
  });
};
