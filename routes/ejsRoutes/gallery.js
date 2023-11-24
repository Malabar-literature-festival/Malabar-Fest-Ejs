var express = require("express");
const Gallery = require("../../models/Gallery");
const ablum = require("../../models/Album");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const metaTags = [
      {
        description:
          "Join the Malabar Literature Festival MLF, a cultural gathering celebrating the rich histories, legacies, languages, and arts of Malabar and its historic connections with distant lands like Kayalpattinam, Gujarat, Lakshadweep, Andaman and Nicobar, Hadhramaut, Malaysia, and Africa. Explore literature through open forums, talks, and debates. Delve into the lifeworlds of Mappila and Dalit subalterns. Discover a unique literary experience with Book Plus.",
      },
      {
        keywords:
          "Malabar Literature Festival, MLF, Malabar, Kozhikode Beach, Calicut Beach, Malabar culture, literature, history, languages, arts, Kayalpattinam, Gujarat, Lakshadweep, Andaman and Nicobar, Hadhramaut, Malaysia, Africa, Mappila, Dalit, Book Plus, Malayalam readers",
      },
      {
        author: "Malabar Literature Festival ",
      },
      {
        robots: "index, follow",
      },
    ];

    const title =
      "Malabar Literature Festival | Celebrating History, Language, and Culture";
    const galleryData = await Gallery.find();
    const albumData = await ablum.find().populate("images").limit(100);
    const album = await ablum.find().populate("images");
    const newData = albumData.map((d) => ({
      ...d.toJSON(),
      _id: d._id.toString(),
    }));
    res.render("gallery", {
      galleryData,
      title,
      metaTags,
      albumData: newData,
      album,
    });
    console.log("testungh", albumData);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
