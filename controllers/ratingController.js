const db = require("../db");

exports.getRatingByTrailId = async (req, res) => {
  try {
    const trailId = req.params.trailId;

    const query = `
    SELECT 
    AVG(rating) AS average_rating,
    COUNT(rating) AS rating_count 
    FROM 
    ratings 
    WHERE 
    trail_id = ?;
        `;

    const [rows] = await db.query(query, trailId);

    const averageRating =
      rows[0].average_rating !== null ? rows[0].average_rating : 0;
    const ratingCount = rows[0].rating_count;

    return res.json({ trailId, averageRating, ratingCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAverageRatingBySubtrailId = async (req, res) => {
  try {
    const subtrailId = parseInt(req.params.subtrailId, 10);

    if (isNaN(subtrailId)) {
      return res.status(400).send("Invalid subtrail ID");
    }

    const query = `
    SELECT 
    AVG(rating) AS average_rating,
    COUNT(rating) AS rating_count 
    FROM 
    ratings 
    WHERE 
    subtrail_id = ?;
      `;

    const [rows] = await db.query(query, [subtrailId]);
    const averageRating = rows[0].average_rating;
    const ratingCount = rows[0].rating_count;

    if (averageRating === null) {
      return res.status(404).send("No ratings found for this subtrail");
    }

    return res.json({ subtrailId, averageRating, ratingCount });
  } catch (err) {
    console.error("Database query error: ", err.message);
    return res.status(500).send("Internal server error");
  }
};

exports.getAverageRatingByStageId = async (req, res) => {
  try {
    const stageId = parseInt(req.params.stageId, 10);

    if (isNaN(stageId)) {
      return res.status(400).send("Invalid stage ID");
    }

    const query = `
    SELECT 
    AVG(rating) AS average_rating,
    COUNT(rating) AS rating_count 
    FROM 
    ratings 
    WHERE 
    stage_id = ?;
        `;
    const ratingCount = rows[0].rating_count;

    const [rows] = await db.query(query, [stageId]);
    const averageRating = rows[0].average_rating;

    if (averageRating === null) {
      return res.status(404).send("No ratings found for this subtrail");
    }

    return res.json({ stageId, averageRating, ratingCount });
  } catch (err) {
    console.error("Database query error: ", err.message);
    return res.status(500).send("Internal server error");
  }
};
