import { Router } from "express";
import * as authControlleurs from "../controlleurs/auth/authControlleur.js";

const authRouteur = Router();

// --------------------------------------------------------
// Routes d'authentification
// --------------------------------------------------------

// Inscription d'un utilisateur
authRouteur.post("/inscription", authControlleurs.authInscription);

// Connexion d'un utilisateur
authRouteur.post("/connexion", authControlleurs.authConnexion);

export default authRouteur;