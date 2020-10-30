import * as express from 'express';
const app = express();

app.get('/', (req, res) => res.send('It Works.'));

app.listen(3000, () => console.log('App is running on 3000'));
