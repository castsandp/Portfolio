'use strict';

const express = require('express');
const app = express();


const PORT = 3000;

app.use(express.urlencoded({
    extended: true
}));



app.use(express.static('public'));

let htmlTop = `<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Sandra Castillo Palacios</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <header> 
        <h1>Sandra Castillo Palacios</h1>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="interests.html">Interest</a></li>
                <li><a href="style.html" target="_blank">Style</a></li>
            </ul>
        </nav>
    </header>
    <main>`;

let htmlBottom = `
</main>
    <footer>
        <p> &copy 04/15/2024 CS290-Web Development @ Oregon State University</p>
    </footer>
</body>
</html>`;

// app.get("/contactInfo", (req, res) => {
//     console.log(req.query);
//     const htmlBody =  `<h1>Get Contact</h1> 
//             <h2>Username: ${req.query.userName}</h2>
//             <h2>Email: ${req.query.userEmail}</h2>
//             <h2>User Comments:</h2>
//             <p>${req.query.message}</p>`;      
//     let htmlResponse = htmlTop + htmlBody + htmlBottom;            
//     res.send(htmlResponse);
// });


app.post("/contactInfo", (req, res) => {
    console.log(req.body);
    const htmlBody = `<h1>Contact</h1> 
            <h2>Username: ${req.body.userName}</h2>
            <h2>Email: ${req.body.userEmail}</h2>
            <h2>User Comments:</h2>
            <p> ${req.body.message}</p>
            <h2>Aditional User Infromation</h2>
            <p> ${req.body.collegeYear}</p>
            <h2>Credits</h2>
            <p> ${req.body.fall}</p>
            <p> ${req.body.winter}</p>
            <p> ${req.body.spring}</p>`; 
               
    let htmlResponse = htmlTop + htmlBody + htmlBottom;        
    res.send(htmlResponse);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});