const { default: mongoose } = require("mongoose");
const Registration = require("../models/Registration");
const { encrypt } = require("../middleware/ccavutil");
const dotenv = require("dotenv"); // Import dotenv
const crypto = require("crypto");
dotenv.config();

// @desc      CREATE NEW REGISTRATION
// @route     POST /api/v1/registration
// @access    private
exports.createRegistration = async (req, res) => {
  try {
    const newRegistration = await Registration.create(req.body);
    res.status(200).json({
      success: true,
      message: "Registration created successfully",
      data: newRegistration,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      GET REGISTRATION
// @route     GET /api/v1/registration/:id
// @access    private
exports.getRegistration = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Registration.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific registration`,
        response,
      });
    }
    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [{ name: { $regex: searchkey, $options: "i" } }, { mobileNumber: { $regex: searchkey, $options: "i" } }],
      }),
    };
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Registration.countDocuments(),
      parseInt(skip) === 0 && Registration.countDocuments(query),
      Registration.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all registration`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC REGISTRATION
// @route     PUT /api/v1/registration/:id
// @access    private
exports.updateRegistration = async (req, res) => {
  try {
    const response = await Registration.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific registration",
      enrollment: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE SPECIFIC REGISTRATION
// @route     DELETE /api/v1/registration/:id
// @access    private
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.query.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

exports.paymentGeneration = async (req, res) => {
  try {
    const orderId = 1234578;
    const amount = 100.0;
    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash("md5").update(process.env.WORKINGKEY).digest();
    var keyBase64 = Buffer.from(md5).toString("base64");
    console.log(keyBase64);
    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]).toString("base64");

    const plainText = `merchant_id=${process.env.MERCHENTID}&order_id=${orderId}&currency=INR&amount=${amount}&redirect_url=https://mlfevent.azurewebsites.net/payment-status&https://mlfevent.azurewebsites.net`;
    const encRequest = encrypt(plainText, keyBase64, ivBase64);
    console.log(plainText, encRequest);
    res.status(200).send('<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + process.env.ACCESSCODE + '"><script language="javascript">document.redirect.submit();</script></form>');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
exports.paymentStatus = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
