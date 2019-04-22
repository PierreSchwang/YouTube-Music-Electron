const fs = require('fs');
const path = require('path');

module.exports = class Locale {

    constructor() {
        this.languages = ["de_DE"];
        this.translations = [];
        this.selectedLanguage = "de_DE";
        this.languages.forEach(lang => {
            var json = JSON.parse(fs.readFileSync(path.join(__dirname, `../assets/languages/${lang}.json`), { encoding: "utf-8" }));
            this.translations.push({ language: lang, dict: json });
        });
    }

    get(key) {
        //TODO
    }

}