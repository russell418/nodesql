 //les 3 lignes qui ses suivent font appelles aux libraire(express,ejs et mysql)
const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');

//Configuration de la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'kda_test',
  password: '',
});

//Connexion à la base de données
connection.connect((erreur) => {
  if (erreur) {
    throw erreur;
  }
  console.log('La connexion à la base de données est établie');
});

//Initialisation du serveur express
const server = express();

//Dire à express de mettre les données venants du formulaire dans BODY
server.use(express.urlencoded({ extended: false }));

//Dire à express où aller trouver les vues(Nos pages web que le user sait voir)
server.set('views');

//Dire à express d'utiliser EJS comme moteur de template
server.set('view engine', 'ejs');

server.get('/apprenants', (req, res) => {
  connection.query('select * from students', (erreur, resultat) => { 
    if (erreur) throw erreur;
    return res.render('apprenants/index', { apprenants: resultat });
  });
});
//Insertion des élements avec les requetes
server.post('/apprenants', (req, res) => {
  console.log('BB');
  connection.query(
    `insert into students(nom,prenom) values('${req.body.nom}','${req.body.prenom}')`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.redirect('/apprenants');
    }
  );
});
//ces 2 ligne nous permet les resultats de news insertion
server.get('/apprenants/new', (req, res) => {
  return res.render('apprenants/new');
});

server.get('/apprenants/:id', (req, res) => {
  connection.query(
    `select * from students where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render('apprenants/show', { apprenant: resultat[0] });
    }
  );
});
//On fait la mise à jour avec update
server.put('/apprenants/update/:id', (req, res) => {
  connection.query(
    `update students SET nom = '${req.body.nom}', prenom ='${req.body.prenom}' where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.send(true);
    }
  );
});

// On utilise delete pour supprimer les données
server.delete('/apprenants/:id',(req,res)=>{
  connection.query(
    `DELETE FROM students  where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.send(true);
    }
  );
});

//Declaration du port et son ecoute
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});




