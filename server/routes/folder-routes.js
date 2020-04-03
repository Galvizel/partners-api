const router = require('express').Router();
const NodeGoogleDrive = require('node-google-drive');

router.get('/', async (req, res) => {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    try {
        const googleDriveInstance = new NodeGoogleDrive({ ROOT_FOLDER: folderId });

        await googleDriveInstance.useServiceAccountAuth({
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });

        const folderResponse = await googleDriveInstance.listFiles(folderId, null, false);
        const files = folderResponse.files.filter(f => f.mimeType === 'application/vnd.google-apps.spreadsheet');
        res.send(files);
    } catch (err) {
        console.log('error fetching files===>>>>', err);
        res.status(500).send(err);
    }
});

module.exports = router;