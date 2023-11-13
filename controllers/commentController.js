const db = require("../db");

exports.getCommentByTrail = async (req, res) => {
  try {
    const trailId = req.params.trailId;

    const query = `
    SELECT 
      comments.*, 
      trails.name AS trail_name, 
      CONCAT(stages.start, ' - ', stages.end) AS stage_name,
      CONCAT(subtrails.start_name, '-', end_name) AS subtrail_name 
    FROM comments 
      LEFT JOIN trails ON comments.trail_id = trails.id 
      LEFT JOIN stages ON comments.stage_id = stages.id 
      LEFT JOIN subtrails ON comments.subtrail_id = subtrails.id 
    WHERE comments.trail_id = ? 
    ORDER BY comments.created_at DESC
  `;

    const [rows] = await db.query(query, [trailId]);

    if (rows.length === 0) {
      res.status(404).send("Trail not found");
    } else {
      res.json(rows);
    }
  } catch (err) {
    console.error("Database query error: ", err.message);
    res.status(500).send("Internal server error");
  }
};

exports.getCommentBySubtrail = async (req, res) => {
  try {
    const subtrailId = req.params.subtrailId;
    const trailId = req.params.trailId;

    const query = `
    SELECT 
      comments.*, 
      trails.name AS trail_name, 
      CONCAT(stages.start, ' - ', stages.end) AS stage_name,
      CONCAT(subtrails.start_name, ' - ', subtrails.end_name) AS subtrail_name 
    FROM comments 
      LEFT JOIN trails ON comments.trail_id = trails.id 
      LEFT JOIN stages ON comments.stage_id = stages.id 
      LEFT JOIN subtrails ON comments.subtrail_id = subtrails.id 
    WHERE comments.subtrail_id = ?
    AND comments.trail_id =  ? 
    ORDER BY comments.created_at DESC
  `;

    const [rows] = await db.query(query, [subtrailId, trailId]);

    if (rows.length === 0) {
      res.status(404).send("Trail not found");
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

exports.getCommentByStage = async (req, res) => {
  try {
    // Extracting stageId and trailId from the request parameters
    const stageId = req.params.stageId;
    const trailId = req.params.trailId;

    // Adapting the SQL query to check for stage_id instead of subtrail_id in the WHERE clause
    const query = `
      SELECT 
        comments.*, 
        trails.name AS trail_name, 
        CONCAT(stages.start, ' - ', stages.end) AS stage_name,
        CONCAT(subtrails.start_name, ' - ', subtrails.end_name) AS subtrail_name 
      FROM comments 
        LEFT JOIN trails ON comments.trail_id = trails.id 
        LEFT JOIN stages ON comments.stage_id = stages.id 
        LEFT JOIN subtrails ON comments.subtrail_id = subtrails.id 
      WHERE comments.stage_id = ?
      AND comments.trail_id = ? 
      ORDER BY comments.created_at DESC
    `;

    // Using stageId and trailId as the parameters for the SQL query
    const [rows] = await db.query(query, [stageId, trailId]);

    if (rows.length === 0) {
      res.status(404).send("Comments not found for the given stage and trail");
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

exports.createComment = async (req, res) => {
  const { username, trailId, subtrailId, stageId, comment, rating } = req.body;

  if (!username || !comment) {
    return res
      .status(400)
      .json({ success: false, message: "Username or comment missing" });
  }

  try {
    // Insert into comments table
    const [commentResult] = await db.query(
      "INSERT INTO comments (username, trail_id, subtrail_id, stage_id, comment, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [username, trailId, subtrailId, stageId, comment, rating]
    );

    // Insert into ratings table
    const [ratingResult] = await db.query(
      "INSERT INTO ratings (username, rating, trail_id, subtrail_id, stage_id, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [username, rating, trailId, subtrailId, stageId]
    );

    // Get the ID of the newly inserted comment
    const commentInsertId = commentResult.insertId;

    // Fetch the new comment from the database
    const [rows] = await db.query("SELECT * FROM comments WHERE id = ?", [
      commentInsertId,
    ]);

    // Check if the new comment is fetched
    if (rows.length > 0) {
      const newComment = rows[0];
      res.json({ success: true, comment: newComment });
    } else {
      throw new Error("Newly inserted comment not found");
    }
  } catch (error) {
    console.error("Error: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error saving comment and rating" });
  }
};
