import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";


export async function creerConge(req: Request, res: Response) {

    // ---------- Récupération des données ---------- //

    const {
        dateDebut,
        dateFin,
        motif,
    } = req.body;

    // Conversion de l'identifiant en nombre
    const employeId = Number(req.body.employeId);

    // ---------- Validation des données ---------- //

    if (
        !dateDebut ||
        !dateFin ||
        isNaN(employeId)
    ) {
        return res.status(400).json({
            message: "Les dates du congé et l'employé sont obligatoires."
        });
    }

    try {

        // ---------- Vérifier que l'employé existe ---------- //

        const employe = await prisma.employe.findUnique({
            where: {
                id: employeId,
            },
        });

        if (!employe) {
            return res.status(404).json({
                message: "Employé introuvable."
            });
        }

        // ---------- Vérifier la cohérence des dates ---------- //

        if (new Date(dateDebut) > new Date(dateFin)) {
            return res.status(400).json({
                message: "La date de début doit être antérieure à la date de fin."
            });
        }

        // ---------- Création du congé ---------- //

        const conge = await prisma.conge.create({

            data: {

                dateDebut,

                dateFin,

                motif,

                // Association avec l'employé
                employe: {
                    connect: {
                        id: employeId,
                    },
                },

                // Le statut sera automatiquement "EnAttente"
                // grâce à la valeur par défaut du schema Prisma.
            },

            include: {
                employe: true,
            },

        });

        // ---------- Réponse ---------- //

        return res.status(201).json({
            message: "Congé créé avec succès.",
            conge,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}

// --------------------------------------------------------
// Lister tous les congés
// --------------------------------------------------------

export async function listerConges(req: Request, res: Response) {

    try {

        // Récupérer tous les congés avec les informations de l'employé
        const conges = await prisma.conge.findMany({

            include: {
                employe: true,
            },

        });

        // ---------- Réponse ---------- //

        return res.status(200).json(conges);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}


// --------------------------------------------------------
// Trouver un congé par ID
// --------------------------------------------------------

export async function congeParId(req: Request, res: Response) {

    // ---------- Récupération de l'identifiant ---------- //

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    try {

        // ---------- Rechercher le congé ---------- //

        const conge = await prisma.conge.findUnique({

            where: {
                id,
            },

            include: {
                employe: true,
            },

        });

        if (!conge) {
            return res.status(404).json({
                message: "Congé introuvable."
            });
        }

        // ---------- Réponse ---------- //

        return res.status(200).json(conge);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}

// --------------------------------------------------------
// Modifier un congé
// --------------------------------------------------------

export async function modifierConge(req: Request, res: Response) {

    // ---------- Récupération de l'identifiant ---------- //

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    // ---------- Récupération des données ---------- //

    const {
        dateDebut,
        dateFin,
        motif,
        statut,
    } = req.body;

    // Conversion de l'identifiant en nombre
    const employeId = Number(req.body.employeId);

    // ---------- Validation des données ---------- //

    if (
        !dateDebut ||
        !dateFin ||
        !statut ||
        isNaN(employeId)
    ) {
        return res.status(400).json({
            message: "Les dates, le statut et l'employé sont obligatoires."
        });
    }

    try {

        // ---------- Vérifier que le congé existe ---------- //

        const conge = await prisma.conge.findUnique({
            where: {
                id,
            },
        });

        if (!conge) {
            return res.status(404).json({
                message: "Congé introuvable."
            });
        }

        // ---------- Vérifier que l'employé existe ---------- //

        const employe = await prisma.employe.findUnique({
            where: {
                id: employeId,
            },
        });

        if (!employe) {
            return res.status(404).json({
                message: "Employé introuvable."
            });
        }

        // ---------- Vérifier les dates ---------- //

        if (new Date(dateDebut) > new Date(dateFin)) {
            return res.status(400).json({
                message: "La date de début doit être antérieure à la date de fin."
            });
        }

        // ---------- Mise à jour du congé ---------- //

        const congeMisAJour = await prisma.conge.update({

            where: {
                id,
            },

            data: {

                dateDebut,

                dateFin,

                motif,

                statut,

                employe: {
                    connect: {
                        id: employeId,
                    },
                },

            },

            include: {
                employe: true,
            },

        });

        // ---------- Réponse ---------- //

        return res.status(200).json({
            message: "Congé modifié avec succès.",
            conge: congeMisAJour,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}



// --------------------------------------------------------
// Supprimer un congé
// --------------------------------------------------------

export async function supprimerConge(req: Request, res: Response) {

    // ---------- Récupération de l'identifiant ---------- //

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    try {

        // ---------- Vérifier que le congé existe ---------- //

        const conge = await prisma.conge.findUnique({
            where: {
                id,
            },
        });

        if (!conge) {
            return res.status(404).json({
                message: "Congé introuvable."
            });
        }

        // ---------- Suppression du congé ---------- //

        await prisma.conge.delete({
            where: {
                id,
            },
        });

        // ---------- Réponse ---------- //

        return res.status(200).json({
            message: "Congé supprimé avec succès."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}