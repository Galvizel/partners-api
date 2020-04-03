require('dotenv').config();
const express = require('express');
const routes = require('./server/routes');

const PORT  = process.env.PORT || 3001;
const app = express();

require('./server/scripts/scheduledPushToApi'); //automatic scheduled cron job

app.use(express.json());
app.use('/api', routes);
app.use(express.static(`${__dirname}/build`));

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/build/index.html`);
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));