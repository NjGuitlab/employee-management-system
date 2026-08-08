import { Router } from "express";
import { authentificationJWT } from "../middleware/auth.js";
import * as dashboardControlleur from "../controlleurs/dashboard/dashboardControlleur.js";

const dashboardRouter = Router();

// --------------------------------------------------------
// Routes Dashboard
// --------------------------------------------------------

// Statistiques générales
dashboardRouter.get(
    "/statistiques",
    authentificationJWT,
    dashboardControlleur.statistiques
);

// Nombre d'employés par département
dashboardRouter.get(
    "/employes-par-departement",
    authentificationJWT,
    dashboardControlleur.employesParDepartement
);

// Nombre d'employés par poste
dashboardRouter.get(
    "/employes-par-poste",
    authentificationJWT,
    dashboardControlleur.employesParPoste
);

// Nombre de congés par statut
dashboardRouter.get(
    "/conges-par-statut",
    authentificationJWT,
    dashboardControlleur.congesParStatut
);

// Moyenne des évaluations
dashboardRouter.get(
    "/moyenne-evaluations",
    authentificationJWT,
    dashboardControlleur.moyenneEvaluations
);

// Les cinq derniers employés embauchés
dashboardRouter.get(
    "/derniers-employes",
    authentificationJWT,
    dashboardControlleur.derniersEmployes
);

export default dashboardRouter;