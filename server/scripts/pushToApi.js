const axios = require('axios');
const {
    GoogleSpreadsheet
} = require('google-spreadsheet');

module.exports = async fileId => {
    try {
        const doc = new GoogleSpreadsheet(fileId);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();

        const mainViewSheet = doc.sheetsByIndex.find(s => s.title === 'MainView');
        const apiSheet = doc.sheetsByIndex.find(s => s.title === 'API');
        const rows = await mainViewSheet.getRows();
        const status = rows[0].Status;
        if (status === 'Live') {
            const api = (await apiSheet.getRows())[0]
            const apiKey = api['API-KEY'].trim();
            const activationKey = api['ACTIVATION-KEY'].trim();
            const transferKey = api['TRANSFER-KEY'].trim();
            const payload = rows.map(row => {
                const newRow = {
                    "domain": row['Domain Name'].trim(),
                    // "contactName": '',
                    // "contactCountry": "",
                    // "contactPhone": "",
                    // "contactEmail": "",
                    // "planId": "",
                    // "discountEnabled": "",
                    // "billingName": "",
                    // "billingEmail": "",
                    // "billingNotes": "",
                    "newDomain": row['New Domain'] && row['New Domain'].trim(),
                    // "paymentKey": "",
                    // "cardFrom": "",
                    "contactName": row['Contact Name'] && row['Contact Name'].trim() || "Contact Name",
                    "contactEmail": row['Contact Email'] && row['Contact Email'].trim() || "contact@email.com",
                    "planId": row['Plan Id'] && row['Plan Id'].trim() || 1,
                    "contactCountry": row['Country Code'] && row['Country Code'].trim() || "+44",
                    "contactPhone": row['Contact Phone'] && row['Contact Phone'].trim() || "123123123",
                }
                if (row['Active'].trim() === 'Yes') {
                    newRow.activationKey = activationKey;
                }
                if (row['New Domain'] && row['New Domain'].trim()) {
                    newRow['transferKey'] = transferKey;
                }
                return newRow;
            });

            const {
                data
            } = await axios.post('https://accessibe.com/api/batch', payload, {
                headers: {
                    'Api-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            })

            console.log('Successful API response==>>', data);
            if (data.status) {
                const rowsToUpdate = rows.filter(row => row['New Domain'] && row['New Domain'].trim());
                if (rowsToUpdate.length) {
                    await Promise.all(rowsToUpdate.map(row => {
                        row['Domain Name'] = row['New Domain'] && row['New Domain'].trim();
                        row['New Domain'] = '';
                        row.save()
                    }));
                    console.log('Domain Names updated with New Domain!!!')
                }
            }
            return data;

        } else {
            console.log('App in Draft Mode, Nothing to do :)');
            return {
                message: 'App in Draft Mode, Nothing to do :)'
            };
        }
    } catch (err) {
        console.log('an error occurred===>>>', err);
        return err;
    }
}