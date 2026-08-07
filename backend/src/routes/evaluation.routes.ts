import { Router } from "express";
import { authentificationJWT, niveauRequis } from "../middleware/auth.js";
import * as evaluationControlleur from "../controlleurs/evaluations/evaluation.controlleur.js";

const evaluationRouter = Router();

// --------------------------------------------------------
// Routes Évaluation
// --------------------------------------------------------

// Créer une évaluation (Admin)
evaluationRouter.post(
    "/",
    authentificationJWT,
    niveauRequis("Admin"),
    evaluationControlleur.creerEvaluation
);

// Lister toutes les évaluations (Utilisateur connecté)
evaluationRouter.get(
    "/",
    authentificationJWT,
    evaluationControlleur.listerEvaluations
);

// Trouver une évaluation par ID (Utilisateur connecté)
evaluationRouter.get(
    "/:id",
    authentificationJWT,
    evaluationControlleur.evaluationParId
);

// Modifier une évaluation (Admin)
evaluationRouter.patch(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    evaluationControlleur.modifierEvaluation
);

// Supprimer une évaluation (Admin)
evaluationRouter.delete(
    "/:id",
    authentificationJWT,
    niveauRequis("Admin"),
    evaluationControlleur.supprimerEvaluation
);

export default evaluationRouter;