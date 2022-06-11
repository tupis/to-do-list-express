const express = require('express')

const router = express.Router();

router.get('/', async (req, res) => {
    await res.render('./pages/index')
})

module.exports = router;