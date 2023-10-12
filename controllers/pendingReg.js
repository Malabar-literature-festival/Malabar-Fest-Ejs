const { default: mongoose, isValidObjectId } = require("mongoose");
const Registration = require("../models/Registration");
const { encrypt } = require("../middleware/ccavutil");
const dotenv = require("dotenv"); // Import dotenv
const crypto = require("crypto");
const qs = require("querystring");
const axios = require("axios");
dotenv.config();

exports.getRegistration = async (req, res) => {
  //   const storedUser = localStorage.getItem("user");
  //   console.log("User from local storage: ", storedUser);
  //   const { user } = req.params;
  //   const user = storedUser;
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

  (async () => {
    try {
      const userDetails = await Registration.find();
      const orderId = userDetails.orderId;
      console.log(orderId);
      console.log(userDetails);
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
    } catch (error) {
      console.error("Error:", error);
    }
  })();
};
