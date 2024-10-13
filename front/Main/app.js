const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

// Load users from JSON file (file-based storage)
const usersFilePath = path.join(__dirname, 'users.json');
let users = require(usersFilePath);

// Save users to JSON file
const saveUsers = () => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// User registration
app.post('/register', (req, res) => {
    const { name, email, password, degree, specialization } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.send('User already exists. Please login.');
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Add new user
    users.push({ name, email, password: hashedPassword, degree, specialization });
    saveUsers();

    res.redirect('/login.html'); // Redirect to login page after successful registration
});

// User login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.send('User not found. Please register.');
    }

    // Compare password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
        return res.send('Invalid password.');
    }

    // Store user session
    req.session.user = { email: user.email, name: user.name };
    res.redirect('/course.html'); // Redirect to course page upon successful login
});

// Authenticated course page
app.get('/course.html', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html'); // Redirect to login if not authenticated
    }
    res.sendFile(path.join(__dirname, 'public', 'course.html')); // Serve the course page
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html'); // Redirect to login page on logout
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
