import { Router } from "express";
import * as posteControlleurs from "../controlleurs/postes/postes.controlleurs.js";
import { authentificationJWT, niveauRequis } from "../middleware/auth.js";

const posteRoute = Router();

// --------------------------------------------------------
// Routes Poste
// --------------------------------------------------------

// Créer un poste (Admin)
posteRoute.post(
    "/",
    authentificationJWT,
    niveauRequis("Admin"),
    posteControlleurs.creerPoste
);

// Lister les postes (Utilisateur connecté)
posteRoute.get(
    "/",
    authentificationJWT,
    posteControlleurs.listerPostes
);

// Trouver un poste par Id (Utilisateur connecté)
posteRoute.get(
    "/:id",
    authentificationJWT,
    posteControlleurs.posteParId
);

// Modifier un poste (Admin)
posteRoute.patch(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    posteControlleurs.modifierPoste
);

// Supprimer un poste (Admin)
posteRoute.delete(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    posteControlleurs.supprimerPoste
);

export default posteRoute;