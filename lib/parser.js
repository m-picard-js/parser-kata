const fs = require('fs');
const Handlebars = require('handlebars');
const config = require('../config');


/**
 * Récupération du contenu à traiter.
 * path : chemin absolu du fichier à ouvrir
 * return : Promise contenant Chaine de caractère du contenu
 */
const fileOpen = function (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.toString());
    });
  });
};

/**
 * Ecriture des données formatées
 * dat : chaîne de caractère à ecrire
 * path : chemin absolu du fichier à écrire
 * return : Promise
 */
const fileWrite = function (data, path) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data.toString(), (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

/**
 * Parcours du fichier
 * content : contenu text du fichier
 * output : objet préformaté pour l'export json
 * return : output
 */
const parse = function (content, output) {
  const lines = content.split('\n');
  output.references = [];
  output.errors = [];

  lines.forEach((l, index) => {
    let parts = l.split(';');
    let errors = checkLine(parts);
    if (errors.length) {
      errors.forEach(e => {
        output.errors.push({
          line: index + 1,
          message: e,
          value: l
        });
      });
    }
    else {
      output.references.push({
        numReference: parts[0],
        color: parts[1],
        price: parts[2],
        size: parts[3]
      });
    }
  });

  return output;
};

/**
  * Vérifie la ligne parsé
  * line: tableau des entités de la ligne
 */
const checkLine = function (line) {
  const errors = [];
  // La ligne doit contenir 4 éléments
  // On sort du test
  if (!line || line.length !== 4) {
    errors.push(config.errorMessages.length);
    return errors;
  }

  // Ref contient 10 chiffres uniquement
  if (line[0].length !== 10 || line[0].match(/\D+/)) {
    errors.push(config.errorMessages.ref);
  }
  // La couleur doit être dans les valeurs définies dans enumColor
  if (config.enumColor.indexOf(line[1]) === -1) {
    errors.push(config.errorMessages.color);
  }
  // Le prix doit une un float valide
  if (!line[2].match(/^[+-]?\d+(\.\d+)?$/)) {
    errors.push(config.errorMessages.price);
  }
  // La taille doit être un entier
  if (!line[3].match(/^\d+$/)) {
    errors.push(config.errorMessages.size);
  }

  return errors;
};

/**
 * Génration du XML à partir du json
 * data : données traitées au format json
 * return : le XML généré
 */
const outputXml = function (data) {
  var source = `
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <report>
    <inputFile>{{inputFile}}</inputFile>
    <references>
      {{#references}}
      <reference color="{{color}}" price="{{price}}" size="{{price}}" numReference="{{numReference}}"/>
      {{/references}}
    </references>
    <errors>
      {{#errors}}
      <error line="{{line}}" message="{{message}}">{{value}}</error>
      {{/errors}}
    </errors>
  </report>`;
  var template = Handlebars.compile(source);


  return template(data);
};


// Méthodes accessibles
module.exports = {
  fileOpen: fileOpen,
  fileWrite: fileWrite,
  outputXml: outputXml,
  parse: parse,
  checkLine: checkLine
};
