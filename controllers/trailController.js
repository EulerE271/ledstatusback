const db = require("../db");

exports.getAllTrail = async (req, res) => {
  try {
    const query = `
      SELECT
        trails.id,
        trails.name,
        trails.description,
        trails.img,
        GROUP_CONCAT(tags.name) AS tags
      FROM
        trails
      LEFT JOIN
        trail_tags ON trails.id = trail_tags.trail_id
      LEFT JOIN
        tags ON trail_tags.tag_id = tags.id
      GROUP BY
        trails.id
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Database query error", err.message);
    res.status(500).send("Internal server error");
  }
};
exports.getTrail = async (req, res) => {
  try {
    const query = `
      SELECT
        trails.id,
        trails.name,
        trails.description,
        trails.img,
        GROUP_CONCAT(tags.name) AS tags
      FROM
        trails
      LEFT JOIN
        trail_tags ON trails.id = trail_tags.trail_id
      LEFT JOIN
        tags ON trail_tags.tag_id = tags.id
      GROUP BY
        trails.id
      LIMIT 3;
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Database query error", err.message);
    res.status(500).send("Internal server error");
  }
};

exports.getTrailById = async (req, res) => {
  try {
    const trailId = req.params.trailId;

    const trailQuery = `
      SELECT
        trails.*,
        GROUP_CONCAT(tags.name) AS tags
      FROM
        trails
      LEFT JOIN
        trail_tags ON trails.id = trail_tags.trail_id
      LEFT JOIN
        tags ON trail_tags.tag_id = tags.id
      WHERE
        trails.id = ?
      GROUP BY
        trails.id;
    `;

    const [trailRows] = await db.query(trailQuery, [trailId]);

    if (trailRows.length === 0) {
      res.status(404).send("Trail not found");
      return;
    }

    const trail = trailRows[0];

    const subtrailsQuery = `
      SELECT id, trail_id, start_name, end_name
      FROM subtrails
      WHERE trail_id = ?;
    `;

    const [subtrails] = await db.query(subtrailsQuery, [trailId]);

    if (subtrails.length > 0) {
      trail.subtrails = subtrails;
    } else {
      const directStagesQuery = `
        SELECT *
        FROM stages
        WHERE trail_id = ?;
      `;

      const [directStages] = await db.query(directStagesQuery, [trailId]);
      trail.stages = directStages;
    }

    res.json(trail);
  } catch (err) {
    console.error("Database query error", err.message);
    res.status(500).send("Internal server error");
  }
};


exports.getSubtrailByID = async (req, res) => {
  try {
    const { trailId, subtrailId } = req.params;

    const subtrailQuery = `
      SELECT *
      FROM subtrails
      WHERE id = ? AND trail_id = ?;
    `;
    const [subtrailRows] = await db.query(subtrailQuery, [subtrailId, trailId]);

    if (subtrailRows.length === 0) {
      return res.status(404).send('Subtrail not found');
    }

    const subtrail = subtrailRows[0];

    const stagesQuery = `
      SELECT id, trail_id, subtrail_id, start, end
      FROM stages
      WHERE subtrail_id = ?;
    `;
    const [stages] = await db.query(stagesQuery, [subtrailId]);
    
    subtrail.stages = stages;

    res.json(subtrail);

  } catch (err) {
    console.error('Database query error', err.message);
    res.status(500).send('Internal server error');
  }
};

exports.getStageByTrail = async (req, res) => {
  try {
    const { trailId, stageId } = req.params;

    const stageQuery = `
      SELECT *
      FROM stages
      WHERE trail_id = ? AND id = ?;
    `;

    const [stageRows] = await db.query(stageQuery, [trailId, stageId]);
    
    if (stageRows.length === 0) {
      return res.status(404).send('Stage not found');
    }

    res.json(stageRows[0]);
  } catch (error) {
    console.error("Error occurred: ", error);
    res.status(500).send("Internal server error");
  }
};

exports.getStageBySubtrail = async (req, res) => {
  try {
    const { trailId, subtrailId, stageId } = req.params;

    const stageQuery = `
      SELECT *
      FROM stages
      WHERE trail_id = ? AND subtrail_id = ? AND id = ?;
    `;

    const [stageRows] = await db.query(stageQuery, [trailId, subtrailId, stageId]);

    if (stageRows.length === 0) {
      return res.status(404).send('Stage not found');
    }

    res.json(stageRows[0]);
  } catch (error) {
    console.error("Error occurred: ", error);
    res.status(500).send("Internal server error");
  }
};
