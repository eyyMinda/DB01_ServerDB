import cron from 'node-cron';
import { connect } from './src/connect.js'

cron.schedule('0 0 * * * *', () => {
    connect().execute('DELETE FROM loginTokens WHERE now() > DATE_ADD(createdAt, INTERVAL 4 hour)', (err, _) => {
        if (err) console.log(err);
        console.log('Deleting old loginTokens');
    });
});