import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// --------------------------------------------------------
// Chargement des variables d'environnement (.env)
// --------------------------------------------------------

dotenv.config();

// --------------------------------------------------------
// Création de l'application Express
// --------------------------------------------------------

const app = express();

// --------------------------------------------------------
// Configuration du port
// Si la variable PORT n'existe pas, on utilise 3000.
// --------------------------------------------------------

const PORT = process.env.PORT || 3000;

// --------------------------------------------------------
// Configuration des middlewares
//
// cors()         : Autorise les requêtes provenant d'autres applications.
// express.json() : Permet de lire les données JSON envoyées dans req.body.
// --------------------------------------------------------

app.use(cors());
app.use(express.json());

// --------------------------------------------------------
// Route de test
// Vérifie que le serveur fonctionne correctement.
// --------------------------------------------------------

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Employee Management API is running!",
    });
});

// --------------------------------------------------------
// Démarrage du serveur
// --------------------------------------------------------

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port http://localhost:${PORT}`);
});