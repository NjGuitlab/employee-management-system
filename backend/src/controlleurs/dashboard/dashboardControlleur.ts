import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";


// --------------------------------------------------------
// Statistiques générales du Dashboard
// --------------------------------------------------------

export async function statistiques(req: Request, res: Response) {

    try {

        // ---------- Compter les ressources ---------- //

        const [
            nombreEmployes,
            nombreDepartements,
            nombrePostes,
            nombreConges,
            nombreEvaluations,
        ] = await Promise.all([

            prisma.employe.count(),

            prisma.departement.count(),

            prisma.poste.count(),

            prisma.conge.count(),

            prisma.evaluation.count(),

        ]);

        // ---------- Réponse ---------- //

        return res.status(200).json({

            nombreEmployes,

            nombreDepartements,

            nombrePostes,

            nombreConges,

            nombreEvaluations,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });

    }

}


// --------------------------------------------------------
// Nombre d'employés par département
// --------------------------------------------------------

export async function employesParDepartement(
    req: Request,
    res: Response
) {

    try {

        // ---------- Récupérer les départements ---------- //

        const departements = await prisma.departement.findMany({

            include: {

                _count: {

                    select: {
                        employes: true,
                    },

                },

            },

            orderBy: {
                nom: "asc",
            },

        });

        // ---------- Formater les données ---------- //

        const resultat = departements.map((departement) => ({

            departement: departement.nom,

            nombreEmployes: departement._count.employes,

        }));

        // ---------- Réponse ---------- //

        return res.status(200).json(resultat);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });

    }

}

// --------------------------------------------------------
// Nombre d'employés par poste
// --------------------------------------------------------

export async function employesParPoste(
    req: Request,
    res: Response
) {

    try {

        // ---------- Récupérer les postes ---------- //

        const postes = await prisma.poste.findMany({

            include: {

                _count: {

                    select: {
                        employes: true,
                    },

                },

            },

            orderBy: {
                nom: "asc",
            },

        });

        // ---------- Formater les données ---------- //

        const resultat = postes.map((poste) => ({

            poste: poste.nom,

            nombreEmployes: poste._count.employes,

        }));

        // ---------- Réponse ---------- //

        return res.status(200).json(resultat);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });

    }

}

// --------------------------------------------------------
// Nombre de congés par statut
// --------------------------------------------------------

export async function congesParStatut(
    req: Request,
    res: Response
) {

    try {

        // ---------- Regrouper les congés par statut ---------- //

        const conges = await prisma.conge.groupBy({

            by: ["statut"],

            _count: {
                id: true,
            },

            orderBy: {
                statut: "asc",
            },

        });

        // ---------- Formater les données ---------- //

        const resultat = conges.map((conge) => ({

            statut: conge.statut,

            nombreConges: conge._count.id,

        }));

        // ---------- Réponse ---------- //

        return res.status(200).json(resultat);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });

    }

}

// --------------------------------------------------------
// Moyenne des évaluations
// --------------------------------------------------------

export async function moyenneEvaluations(
    req: Request,
    res: Response
) {

    try {

        // ---------- Calcul de la moyenne ---------- //

        const resultat = await prisma.evaluation.aggregate({

            _avg: {
                note: true,
            },

        });

        // ---------- Réponse ---------- //

        return res.status(200).json({

            moyenne: resultat._avg.note ?? 0,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });

    }

}

// --------------------------------------------------------
// Les 5 derniers employés embauchés
// --------------------------------------------------------

export async function derniersEmployes(
    req: Request,
    res: Response
) {

    try {

        // ---------- Récupérer les 5 derniers employés ---------- //

        const employes = await prisma.employe.findMany({

            take: 5,

            orderBy: {
                dateEmbauche: "desc",
            },

            include: {

                poste: true,

                departement: true,

            },

        });

        // ---------- Réponse ---------- //

        return res.status(200).json(employes);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });

    }

}