const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public')
    }
    // Dodajte druge konfiguracije ako je potrebno
};
