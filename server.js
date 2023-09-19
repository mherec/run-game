const express = require('express');
const app = express();
const PORT = 3000; // Możesz wybrać inny port

// Serwuj pliki statyczne z katalogu "runApp"
app.use(express.static('runApp'));

app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}...`);
});

module.exports = app;