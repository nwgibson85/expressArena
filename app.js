const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.get('/burgers', (req, res) => {
    res.send('Juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
    res.send("We don't serve that here. Never call again!");
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if(!name) {
        return res.status(400).send('Please provide a name!');
    }
    
    if(!race) {
        return res.status(400).send('Please provide a race!');
    }

    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

    res.send(greeting);
});

//Drill 1

app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;

    if(!a) {
        return res.status(400).send('a is required!');
    }

    if(!b) {
        return res.status(400).send('b is required!');
    }

    let numA = parseFloat(a);
    let numB = parseInt(b);
    
    if(Number.isNaN(numA)) {
        return res.status(400).send('a must be a number!');
    }

    if(Number.isNaN(numB)) {
        return res.status(400).send('b must be a number!');
    }

    let numC = numA + numB;

    const sum = `"The sum of ${numA} and ${numB} is ${numC}".`;

    res.status(200).send(sum);
});

// Drill 2

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = req.query.shift;
    
    if(!text) {
        return res.status(400).send('text is required!');
    }

    if(!shift) {
        return res.status(400).send('shift is required!');
    }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res.status(400).send('shift must be a number');
    }

    const start = 'A'.charCodeAt(0);

    const cipher = text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0);

        if(code < start || code > (start + 26)) {
            return char;
        }

        let change = code - start;
        change = change + numShift;
        change = change % 26;

        const shiftedChar = String.fromCharCode(start + change);
        return shiftedChar;
    })
    .join('');

    res.status(200).send(cipher);
});

// Drill 3

app.get('/lotto', (req, res) => {
    const {arr} = req.query;
    

    if(!arr) {
        return res.status(400).send('arr is required!');
    } 

    if(!Array.isArray(arr)) {
        return res.status(400).send('numbers must be an array');
    }

    const guesses = arr.map(n => parseInt(n)).filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if(guesses.length != 6) {
        return res.status(400).send("arr must be integers between 1 and 6");
    }

    const lottoNums = [];

    for (let i = 0; i < 6; i ++) {
        lottoNums.push(Math.floor(Math.random() * 20));
    }

    const results = [];

    function intersect(guesses, lottoNums) {
        var d1 = {};
        var d2 = {};
        
        for (var i = 0; i < guesses.length; i++) {
            d1[guesses[i]] = true;
        }
        for (var j = 0; j < lottoNums.length; j++) {
            d2[lottoNums[j]] = true;
        }
        for (var k in d1) {
            if (d2[k]) 
                results.push(k);
        }
        return results;
    }

    switch(true) {
        case results.length < 4:
            return res.status(200).send('Sorry, you lose!');
        case results.length === 4:
            return res.status(200).send('Congratulations, you win a free ticket');
        case results.length === 5:
            return res.status(200).send('Congratulations! You win $100!');
        case results.length === 6:
            return res.status(200).send('Wow! Unbelievable! You could have won the mega millions!');
    }
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});