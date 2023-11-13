const db = require('../db');

exports.getTrailDataById = async (req, res) => {
    try {
        const { trailId } = req.params;

        const [geoResult] = await db.query('SELECT geo_data FROM geodata_trail WHERE trail_id = ?', [trailId]);
        
        if (!geoResult || geoResult.length === 0) {
            return res.status(404).json({ message: 'No data found for the given trail ID.' });
        }
        
        const [shelterResult] = await db.query('SELECT * FROM shelters WHERE trail_id = ?', [trailId]);

        // Construct the response object
        const responseData = {
            geoData: geoResult.map(result => result.geo_data), // Return all geo_data
            shelters: shelterResult
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
