import { Router } from "express";
import { authentificationJWT, niveauRequis } from "../middleware/auth.js";
import * as employeControlleur from "../controlleurs/employes/employeControlleur.js";

const employeRouter = Router();

// --------------------------------------------------------
// Routes Employé
// --------------------------------------------------------

// Créer un employé (Admin)
employeRouter.post(
    "/",
    authentificationJWT,
    niveauRequis("Admin"),
    employeControlleur.creerEmploye
);

// Modifier un employé (Admin)
employeRouter.patch(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    employeControlleur.modifierEmploye
);

// Lister les employés (Utilisateur connecté)
employeRouter.get(
    "/",
    authentificationJWT,
    employeControlleur.listerEmployes
);

// Trouver un employé par ID (Utilisateur connecté)
employeRouter.get(
    "/:id",
    authentificationJWT,
    employeControlleur.employeParId
);

// Supprimer un employé (Admin)
employeRouter.delete(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    employeControlleur.supprimerEmploye
);

export default employeRouter;