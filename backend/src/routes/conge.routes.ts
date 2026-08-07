import { Router } from "express";
import { authentificationJWT, niveauRequis } from "../middleware/auth.js";
import * as congeControlleur from "../controlleurs/conges/conge.controlleur.js";

const congeRouter = Router();

// --------------------------------------------------------
// Routes Congé
// --------------------------------------------------------

// Créer un congé
congeRouter.post(
    "/",
    authentificationJWT,
    congeControlleur.creerConge
);

// Lister tous les congés
congeRouter.get(
    "/",
    authentificationJWT,
    congeControlleur.listerConges
);

// Trouver un congé par ID
congeRouter.get(
    "/:id",
    authentificationJWT,
    congeControlleur.congeParId
);

// Modifier un congé (Admin)
congeRouter.patch(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    congeControlleur.modifierConge
);

// Supprimer un congé (Admin)
congeRouter.delete(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    congeControlleur.supprimerConge
);

export default congeRouter;