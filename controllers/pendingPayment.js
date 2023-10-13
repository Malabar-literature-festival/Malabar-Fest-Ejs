const { default: mongoose, isValidObjectId } = require("mongoose");
const Registration = require("../models/Registration");
const TempReg = require("../models/TempReg");
const { encrypt } = require("../middleware/ccavutil");
const dotenv = require("dotenv"); // Import dotenv
const crypto = require("crypto");
const qs = require("querystring");
const axios = require("axios");
dotenv.config();

exports.getPendingPayment = async (req, res) => {
  console.log(req.query);
  const { orderId, userId } = req.query;
  const access_code = process.env.ACCESSCODE;
  const working_key = process.env.WORKINGKEY;

  function encrypt(plainText, key = working_key) {
    const keyHash = crypto.createHash("md5").update(key).digest();
    const initVector = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]);
    const cipher = crypto.createCipheriv("aes-128-cbc", keyHash, initVector);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  function decrypt(encryptedText, key = working_key) {
    const keyHash = crypto.createHash("md5").update(key).digest();
    const initVector = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]);
    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      keyHash,
      initVector
    );
    let decrypted = decipher.update(encryptedTextBuffer, "binary", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  try {
    // const userDetails = await Registration.find();
    // const orderId = userDetails.orderId;

    console.log(orderId);
    const order_id = orderId; // Replace with your order ID
    const params = { order_no: order_id, reference_no: "" };
    const encReq = encrypt(JSON.stringify(params));
    const final_data = qs.stringify({
      enc_request: encReq,
      access_code: access_code,
      command: "orderStatusTracker",
      request_type: "JSON",
      response_type: "JSON",
    });

    const ccavenue_res = await axios.post(
      "https://apitest.ccavenue.com/apis/servlet/DoWebTrans",
      final_data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const info = qs.parse(ccavenue_res.data);
    console.log("Info: ", info);

    const payment_status = decrypt(info.enc_response);
    console.log("Payment Status: ", payment_status);
    const status = info.status;
    if (status === "0" || 0) {
      const user = await TempReg.findByIdAndUpdate(userId, {
        paymentStatus: "Failed",
      });
    } else {
      const tempRegData = await TempReg.findById(userId);

      if (tempRegData) {
        var registrationData = new Registration({
          name: tempRegData.name,
          gender: tempRegData.gender,
          mobileNumber: tempRegData.mobileNumber,
          email: tempRegData.email,
          profession: tempRegData.profession,
          regDate: tempRegData.regDate,
          matterOfInterest: tempRegData.matterOfInterest,
          regType: tempRegData.regType,
          image: tempRegData.image,
          amount: tempRegData.amount,
          orderId: tempRegData.orderId,
        });

        // Save the registration data to the Registration collection
        await registrationData.save();

        // Delete the tempRegData as it's no longer needed
        await TempReg.findByIdAndRemove(userId);
      }
    }
    console.log("Status: ", status);
    return payment_status;
  } catch (error) {
    console.error("Error:", error);
  }
};
