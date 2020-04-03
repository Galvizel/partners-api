const router = require('express').Router();
const folderRoutes = require('./folder-routes');
const fileRoutes = require('./file-routes');

router.use('/folders', folderRoutes);
router.use('/files', fileRoutes);

module.exports = router;