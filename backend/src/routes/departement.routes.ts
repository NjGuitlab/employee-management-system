import { Router } from "express";
import * as departementControlleurs from "../controlleurs/departements/departementControlleur.js";
import { authentificationJWT, niveauRequis } from "../middleware/auth.js";

const router = Router();

// --------------------------------------------------------
// Routes Département
// --------------------------------------------------------

// Créer un département (Admin)
router.post(
    "/",
    authentificationJWT,
    niveauRequis("Admin"),
    departementControlleurs.creerDepartement
);

// Récupérer tous les départements (Utilisateur connecté)
router.get(
    "/",
    authentificationJWT,
    departementControlleurs.listeDepartements
);

// Récupérer un département par son id (Utilisateur connecté)
router.get(
    "/:id",
    authentificationJWT,
    departementControlleurs.departementParId
);

// Modifier un département (Admin)
router.patch(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    departementControlleurs.modifierDepartement
);

// Supprimer un département (Admin)
router.delete(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    departementControlleurs.supprimerDepartement
);

export default router;