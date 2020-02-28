/**
 * Main application file
 */

'use strict';

const path = require('path');
const parser = require('./lib/parser');
const args = process.argv;

// Vérification du format de la commande
if (args.length !== 5 || ['--help', '-h'].indexOf(args[2]) !== -1) {
  console.log(`
Usage: node index.js <source> <output_format> <target>

where :
  <source> is the relative path of the file to parser
  <output_format> is 'json' or 'xml'
  <target> is the relative path of the output file


node index.js -h  displays this output
node index.js --help  displays this output
`);
  process.exit(-1);
}


const filePath = path.join(__dirname, args[2]);
const format = args[3];
const targetPath = path.join(__dirname, args[4]);

// Traitement
// 1° Ouverture du fichier
// 2° Parcours du contenu, et vérification de la cohérence. Récupération des données formatées json
// 2°(bis) Génération du XML si requis
// 3° Ecriture du fichier au chemin souhaité
parser.fileOpen(filePath)
  .then(data => {
    // Passage par une promesse pour le traitement asynchrone de fs.writeFile (dans parser.fileWrite())
    let promise;
    let pathParts = filePath.split('/');
    const json = { inputFile: pathParts[pathParts.length - 1] };

    parser.parse(data, json);
    if (format === 'xml') {
      let xml = parser.outputXml(json, targetPath);
      promise = parser.fileWrite(xml, targetPath);
    }
    else {
      promise = parser.fileWrite(JSON.stringify(json), targetPath);
    }

    return promise;
  })
  .then(() => {
    process.exit(1);
  })
  .catch(err => {
    // Récupération des erreurs et sortie du process
    console.error(err);
    process.exit(-1);
  });
