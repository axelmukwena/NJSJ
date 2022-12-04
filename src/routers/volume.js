const { Router } = require("express");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const bodyParser = require("body-parser");
const { volumes } = require("../models/volume");
const auth = require("../middleware/auth");

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Add volume
router.post("/volumes", auth, async (req, res) => {
  try {
    const volume = new volumes(req.body);
    await volume.save();
    res.status(201).send(volume);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get latest volume
router.get("/volumes/latest", async (req, res) => {
  const volume = await volumes.find().sort({ issue: -1 }).limit(1);
  if (!volume) return res.status(404).send();
  res.send(volume);
});

// get all volumes
router.get("/volumes", async (req, res) => {
  const match = {};
  let sort = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  const limit = parseInt(req.query.limit) || 6;
  const skip = parseInt(req.query.skip) || 0;
  const volume = await volumes.find().sort(sort).limit(limit).skip(skip);

  if (!volume) return res.status(404).send();
  res.send(volume);
  sort = undefined;
});

// delete volume
router.delete("/volumes/:id", auth, async (req, res) => {
  try {
    const volume = await volumes.findById(req.params.id);

    if (!volume) return res.status(404).send();
    await volume.remove();
    res.send(volume);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Upload volume
const upload = multer({
  limits: {
    fileSize: 50000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(
        new Error(
          "Please upload an image file for the cover and pdf for the editorial"
        )
      );
    }
    cb(undefined, true);
  },
});

const uploads = upload.fields([
  {
    name: "cover",
    maxCount: 1,
  },
  {
    name: "editorial",
    maxCount: 1,
  },
]);

router.post(
  "/volumes/publish",
  auth,
  urlencodedParser,
  uploads,
  async (req, res) => {
    try {
      const coverBuffer = req.files.cover[0].buffer;
      const editorialBuffer = req.files.editorial[0].buffer;
      const currentVol = await volumes.findOne().sort({ issue: -1 });
      let nextVol = 0;

      if (!currentVol) nextVol++;
      else {
        nextVol = currentVol.issue + 1;
      }

      const volume = await new volumes({
        issue: nextVol,
        title: req.body.title,
        abstract: req.body.abstract,
        publishedDate: req.body.publishedDate,
        cover: coverBuffer,
        file: editorialBuffer,
      });
      await volume.save();
      res.redirect("/publish/volume");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// download volume cover
router.get("/volumes/cover/:id", async (req, res) => {
  try {
    const volume = await volumes.findById(req.params.id);

    if (!volume || !volume.cover) {
      return res.status(404).send();
    }
    res.set("Content-Type", "image/png");
    res.send(volume.cover);
  } catch (error) {
    res.status(500).send();
  }
});
// router.post('/volumes/editorial/:id', auth, upload2.single('file'),async (req, res) => {
//     try {
//         const buffer = req.file.buffer
//         const volume = await volumes.findById(req.params.id)

//         volume.file = buffer

//         await volume.save()
//         res.send(volume)
//     } catch (error) {
//         res.status(500).send({error: error.message})
//     }
// },(error, req, res , next) => {
//     res.status(400).send({error: error.message})
// })

// download volume editorial
router.get("/volumes/editorial/:id", async (req, res) => {
  try {
    const volume = await volumes.findById(req.params.id);

    if (!volume || !volume.file) {
      return res.status(404).send();
    }
    res.set("Content-Type", "application/pdf");
    res.send(volume.file);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
