const { CronJob } = require('cron');
const NodeGoogleDrive = require('node-google-drive');
const pushToApi = require('./pushToApi');

const job = new CronJob('0 * * * *', async () => {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    try {
        const googleDriveInstance = new NodeGoogleDrive({ ROOT_FOLDER: folderId });

        await googleDriveInstance.useServiceAccountAuth({
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });

        const folderResponse = await googleDriveInstance.listFiles(folderId, null, false);
        await Promise.all(folderResponse.files.map(file => {
            return pushToApi(file.id);
        }));
        console.log('Files pushed to API at: ', new Date());
    } catch (err) {
        console.log('error fetching files===>>>>', err);
    }

}, null, true, 'America/New_York');

job.start();