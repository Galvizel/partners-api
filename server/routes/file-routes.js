const router = require('express').Router();
const pushToApi = require('../scripts/pushToApi');

router.put('/:fileId', async (req, res) => {
    const { fileId } = req.params;
    try {
        const resp = await pushToApi(fileId)
        res.send(resp);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;