const db = require("../db");

exports.searchTrails = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Query parameter q is required.",
      });
    }

    const [trails] = await db.query(
      "SELECT id, name, img, description FROM trails WHERE name LIKE ? LIMIT 50",
      [`%${searchTerm}%`]
    );


    if (trails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trails found matching the query.",
      });
    }

    return res.json({
      success: true,
      data: trails,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
