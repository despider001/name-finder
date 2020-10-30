import indexRouter from './routes/index';
const port = process.env.PORT || 3003;
import * as express from 'express';
const app = express();

app.use('/', indexRouter);
app.use('*', (req, res) => res.redirect('/'));

app.listen(port, () => {
    console.log('App is running on', port);
});

