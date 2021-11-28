const router = require('express').Router();
const authMiddle = require('../middlewares/auth');

router.use(require('./auth'));
router.use(authMiddle, require('./movies'));
router.use(authMiddle, require('./users'));

module.exports = router;
