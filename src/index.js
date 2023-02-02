const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 9000;
const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(logger('dev'));
app.use(methodOverride('_method'));
// app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/recipes', require('./routes/recipes'));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))