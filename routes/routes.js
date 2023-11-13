const express = require('express');
const { checkHealth } = require('../controllers/healthController');
const { getTrail, getTrailById, getSubtrailByID, getStagesByID, getStageBySubtrail, getStageByTrail, getAllTrail } = require('../controllers/trailController');
const { getCommentByTrail, createComment, getCommentBySubtrail, getCommentByStage } = require('../controllers/commentController');
const { searchTrails } = require('../controllers/searchController');
const { getWeather } = require('../controllers/weather');
const { getRatingByTrailId, getRatingBySubTrailId, getAverageRatingBySubtrailId, getAverageRatingByStageId } = require('../controllers/ratingController');
const { getCoordinatesById, getTrailDataById } = require('../controllers/mapController');
const router = express.Router();

router.get('/', (req, res) =>  {
    res.send("Router file is working");
});

router.get('/health', checkHealth);

//Trail routes
router.get('/trails/all', getAllTrail);
router.get('/trails', getTrail);
router.get('/trails/:trailId', getTrailById);
router.get('/trails/:trailId/subtrails/:subtrailId', getSubtrailByID);
router.get('/trails/:trailId/stages/:stageId', getStageByTrail);
router.get('/trails/:trailId/subtrails/:subtrailId/stages/:stageId', getStageBySubtrail);

//Comment routes
router.get('/trails/:trailId/comments', getCommentByTrail);
router.get('/trails/:trailId/subtrails/:subtrailId/comments', getCommentBySubtrail)
router.get('/trails/:trailId/stages/:stageId/comments', getCommentByStage)
router.post('/comments/create', createComment);

//Util routes
router.get('/search', searchTrails);
router.get('/weather/:location', getWeather);
router.get('/trails/:trailId/rating', getRatingByTrailId);
router.get('/trails/:trailId/subtrails/:subtrailId/rating', getAverageRatingBySubtrailId);
router.get('/trails/:trailId/stages/:stageId/rating', getAverageRatingByStageId)

//Map routes
router.get('/geodata/:trailId', getTrailDataById);


module.exports = router;