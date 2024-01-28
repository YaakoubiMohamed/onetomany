const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost', //127.0.0.1
    user: 'root',
    password: '',
    database: 'onetomany'
})

connection.connect((error) =>{
    if(error){
        console.log("Error de conexion a la base de donne")
    } else {
        console.log("Conexion reussie");
    }
})

app.post('/categories',(req,res)=> {
    let categorie = req.body;
    console.log(categorie);
    let sql = "INSERT INTO categories (nom) VALUES (?)";
    connection.query(sql,[categorie.nom],(err,result)=>{
        if(err){
            return res.status(500).send("Erreur lors de l'ajout de categorie");
        } else {
            return res.status(201).send(result);
        }
    })
})

app.get('/categories',(req,res)=>{
    let sql = "SELECT * FROM categories" ;
    connection.query(sql,(err,result) => {
        if(err){
            return res.status(500).json({error:"Erreur de recuperation des categories"})
        } else {
            return res.status(200).json({categories: result})
        }
    })
})

/**
 * getcategorie by id
 * updatecategorie
 * deletecategorie by id
**/


// Get categorie by ID
app.get('/categories/:id', (req, res) => {
    const categorieId = req.params.id;
    let sql = "SELECT * FROM categories WHERE id = ?";
    
    connection.query(sql, [categorieId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération de la catégorie" });
        } else {
            if (result.length === 0) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            } else {
                return res.status(200).json({ categorie: result[0] });
            }
        }
    });
});

// Update categorie by ID
app.put('/categories/:id', (req, res) => {
    const categorieId = req.params.id;
    const { nom } = req.body;
    let sql = "UPDATE categories SET nom = ? WHERE id = ?";

    connection.query(sql, [nom, categorieId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour de la catégorie" });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            } else {
                return res.status(200).json({ message: "Catégorie mise à jour avec succès" });
            }
        }
    });
});

// Delete categorie by ID
app.delete('/categories/:id', (req, res) => {
    const categorieId = req.params.id;
    let sql = "DELETE FROM categories WHERE id = ?";

    connection.query(sql, [categorieId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la suppression de la catégorie" });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            } else {
                return res.status(200).json({ message: "Catégorie supprimée avec succès" });
            }
        }
    });
});

app.post('/produits', (req,res) =>{
    //on recupere le produit envoye par le client
    let produit = req.body;
    let sql = "INSERT INTO produits (`nom`, `prix`, `quantite`, `marque`, `description`, `categorieID`) VALUES(?,?,?,?,?,?)";
    //On insere dans la bdd
    connection.query(sql,[produit.nom,produit.prix,produit.quantite,produit.marque,produit.description,produit.categorieID],(err,result) =>{
        if(err){
            return res.status(500).json({Error : 'Produit non ajoute'});
        } else {
            res.status(201).json({message:'Le Produit a ete bien cree'})
        }
    })
})

app.get('/produits',(req,res)=>{
    let sql = "SELECT * FROM produits" ;
    connection.query(sql,(err,result) => {
        if(err){
            return res.status(500).json({error:"Erreur de recuperation des produits"})
        } else {
            return res.status(200).json({produits: result})
        }
    })
})

/**
 * getproduit by id
 * updateproduit
 * deleteproduit by id
 * getproduits by categorie id
**/

// Assuming 'connection' is your MySQL connection object
// Make sure to import necessary modules and set up your connection before defining these routes

// Get produit by ID
app.get('/produits/:id', (req, res) => {
    const produitId = req.params.id;
    let sql = "SELECT * FROM produits WHERE id = ?";
    
    connection.query(sql, [produitId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération du produit" });
        } else {
            if (result.length === 0) {
                return res.status(404).json({ error: "Produit non trouvé" });
            } else {
                return res.status(200).json({ produit: result[0] });
            }
        }
    });
});

// Update produit by ID
app.put('/produits/:id', (req, res) => {
    const produitId = req.params.id;
    const { nom, prix,quantite, marque, description, categorieID } = req.body;
    let sql = "UPDATE produits SET nom = ?, prix = ?, quantite = ?, marque = ?, description = ?, categorieID = ? WHERE id = ?";

    connection.query(sql, [nom, prix, quantite, marque, description, categorieID,produitId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Produit non trouvé" });
            } else {
                return res.status(200).json({ message: "Produit mis à jour avec succès" });
            }
        }
    });
});

// Delete produit by ID
app.delete('/produits/:id', (req, res) => {
    const produitId = req.params.id;
    let sql = "DELETE FROM produits WHERE id = ?";

    connection.query(sql, [produitId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la suppression du produit" });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Produit non trouvé" });
            } else {
                return res.status(200).json({ message: "Produit supprimé avec succès" });
            }
        }
    });
});

// Get produits by categorie ID
app.get('/produits/categorie/:categorieId', (req, res) => {
    const categorieId = req.params.categorieId;
    let sql = "SELECT * FROM produits WHERE categorieId = ?";
    
    connection.query(sql, [categorieId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération des produits par catégorie" });
        } else {
            return res.status(200).json({ produits: result });
        }
    });
});



app.listen(3000, () =>{
    console.log("Server is running on port 3000");
})
