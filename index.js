// Entry point to server

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mysql = require('mysql2')
const db = require('./db/database.js');
const session = require('express-session');
const { hash } = require('crypto');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// Set View Engine
app.engine('hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

// Initialize Middleware
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "cs361-project-rousj",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

// Functions

const saltRounds = 10;

async function hashPassword(password) {
    try {
        let hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }
    catch (err) {
        console.error('Error hashing password: ', err)
    }
}


// Routes

app.get('/', async (req, res) => {

    // Get initials for nav bar login 
    let initials = null;
    if (req.session.email) {
        initials = await db.getInitials(req.session.email);
    }

    res.render('home', { title: 'Home', stylesheet: '/styles/home.css', isLoggedIn: req.session.isLoggedIn, initials: initials });
})

app.get('/login', (req, res) => {
    res.render('login', { invalidLogin: req.session.invalidLogin, isLoggedIn: req.session.isLoggedIn, stylesheet: "./styles/login.css" })
})

app.post('/login', async (req, res) => {

    // Compare hashed password 

    let compare = await db.compareCreds(req.body.email, req.body.password);

    if (compare) {
        // Set session variables for login 
        req.session.isLoggedIn = true;
        req.session.invalidLogin = false;
        req.session.email = req.body.email;
        res.redirect('/')
    }

    else {
        req.session.invalidLogin = true;
        res.redirect('/login')
    }


})

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register', isLoggedIn: req.session.isLoggedIn, stylesheet: './styles/login.css' })
})

app.post('/register', async (req, res) => {
    // Query Database to insert new user 
    // fname, lname, email, hashed_password
    let hashedPassword = await hashPassword(req.body.password);

    let userID = await db.addUser({ fname: req.body.fname, lname: req.body.lname, email: req.body.email, hashedPassword: hashedPassword })

    // Set up session 
    req.session.isLoggedIn = true;
    req.session.email = req.body.email;

    res.redirect('/');


})

app.get('/sign-out', (req, res) => {
    // Destroy the session 
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroyign session:", err);
            return res.redirect('/');
        }
        res.redirect('/')
    })
})

app.get('/portfolio', async (req, res) => {

    let id = null;
    let portfolio = null;
    let watchlist = null;
    let initials = null;
    // For stock in portfolio 
    if (req.session.email) {
        // Get userId
        id = await db.getUserId(req.session.email);
        // Get user portfolio
        portfolio = await db.getUserPortfolio(id);

        watchlist = await db.getUserWatchlist(id);

        initials = await db.getInitials(req.session.email);

    }

    // Render price 
    res.render('portfolio', {
        portfolio: portfolio, watchlist: watchlist, isLoggedIn: req.session.isLoggedIn, stylesheet: './styles/portfolio.css',
        initials: initials
    })
})

app.post('/addStockToPortfolio', async (req, res) => {
    // Get User ID from database 
    let userId = await db.getUserId(req.session.email);

    // Check if stock already in user's portfolio 

    // Insert stock into portfolio 
    let stock = {
        userId: userId,
        ticker: req.body.ticker,
        qty: parseInt(req.body.qty)
    };

    let portfolioId = await db.addStockToPortfolio(stock);

    // Redirect to portfolio 
    res.redirect('/portfolio')

})

app.post('/addStockToWatchlist', async (req, res) => {
    let userId = await db.getUserId(req.session.email);

    let stock = {
        userId: userId,
        ticker: req.body.ticker
    }

    let watchListId = await db.addStockToWatchList(stock);

    res.redirect('/portfolio');
})

app.delete('/deleteStockFromPortfolio', async (req, res) => {
    // Call Delete Method 
    let id = await db.getUserId(req.session.email);
    let params = { id: id, ticker: req.body.ticker };
    let result = await db.deleteStockFromPortfolio(params);
    if (result.affectedRows == 1) {
        res.json({ success: true, message: "Stock deleted from portfolio" })
    }
    else {
        res.send("Error deleting stock")
    }
})

app.delete('/deleteStockFromWatchlist', async (req, res) => {
    // Call Delete Method 
    let id = await db.getUserId(req.session.email);
    let params = { id: id, ticker: req.body.ticker };
    let result = await db.deleteStockFromWatchlist(params);
    if (result.affectedRows == 1) {
        res.json({ success: true, message: "Stock deleted from watchlist" })
    }
    else {
        res.send("Error deleting stock")
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})