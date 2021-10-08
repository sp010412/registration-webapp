const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const flash = require('express-flash');
// const session = require('express-session');
const registrationNumbers = require("./registration");
// const routes = require('./routs')
const app = express();

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts',
});

const pg = require("pg");
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

//which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration_app';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// const Routes = routes(greetInsta)

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
// }));
// app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())


const regInsta = registrationNumbers(pool);


app.get('/', function (req, res) {
    res.render('index')
});

app.post('/reg_numbers', async function (req, res) {

    try {
        var plateIn = req.body.inputBox;
        await regInsta.regsIn(plateIn);
        var append = await regInsta.display();
        await regInsta.platesIn(plateIn);
        res.render('index', {
            output: append,
        }
        );
    } catch (err) {
        console.log(err)
    }

});

app.post('/showButton', async function (req, res) {
    var showFromTown = req.body.slct;
    var list = await regInsta.findFromTown(showFromTown);

    console.log(showFromTown)
    console.log(list)
    res.render('index', {
        output: list
    }
    );
});


app.post('/showAllButton', async function (req, res) {
    res.render('index', { output: await regInsta.allRegistrations() });
});


app.post('/resetButton', async function (req, res) {
    // req.flash('infoIn', 'Database is successfully cleared!');
    await regInsta.clearTable();
    res.redirect('/');
});


let PORT = process.env.PORT || 2022;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});