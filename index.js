const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())


const regInsta = registrationNumbers(pool);


app.get('/', async function (req, res) {
    res.render('index',{
        output: await regInsta.allRegistrations()
    })
});

app.post('/reg_numbers', async function (req, res) {

    try {

        const regex = /^((CA|PA|WC)\s\d{3}\-\d{3})$|^((CA|PA|WC)\s\d{3}\s\d{3})$|^((CA|PA|WC)\s\d{4})$/;
        var plateIn = req.body.inputBox;

        if (plateIn) {
            var listDi = await regInsta.dupli(plateIn);
            if (regex.test(plateIn) === false) {
                req.flash('infoRed', 'Not a registration plate! eg; CA 12345 ');
            }
            else if (listDi.rowCount === 1) {
                req.flash('infoRed', 'Registration already exists!');
            }
            else if (regex.test(plateIn)) {
                req.flash('infoIn', 'Plate Added!');
                await regInsta.platesIn(plateIn);
            }
        }
        else if (plateIn === "") {
            req.flash('infoRed', 'Enter a registration plate!');
        }

        res.render('index', {
            output: await regInsta.allRegistrations()
        }
        );
    } catch (err) {
        console.log(err)
    }

});

app.post('/showButton', async function (req, res) {
    var showFromTown = req.body.slct;
    var list = await regInsta.findFromTown(showFromTown);

    if (list.length === 0 && showFromTown === "1" ) {
        req.flash('infoRed', 'No registration plates from Cape Town!');
    }
    else if (list.length === 0 && showFromTown === "2") {
        req.flash('infoRed', 'No registration plates from Pretoria!');
    }
    else if (list.length === 0 && showFromTown === "3") {
        req.flash('infoRed', 'No registration plates from Worcester!');
    }
    else if (list.length === 0 && showFromTown === "0"){
        req.flash('infoRed', 'Select prefered town!');
    }


    res.render('index', {
        output: list
    }
    );
});


app.post('/showAllButton', async function (req, res) {
    res.render('index', { output: await regInsta.allRegistrations() });
});


app.post('/resetButton', async function (req, res) {
    req.flash('infoIn', 'Database is successfully cleared!');
    await regInsta.clearTable();
    res.redirect('/');
});


let PORT = process.env.PORT || 2022;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});