import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";

// --------------------------------------------------------
// Créer une nouvelle évaluation
// --------------------------------------------------------

export async function creerEvaluation(req: Request, res: Response) {

    // ---------- Récupération des données ---------- //

    const {
        dateEvaluation,
        note,
        commentaire,
    } = req.body;

    // Conversion de l'identifiant en nombre
    const employeId = Number(req.body.employeId);

    // ---------- Validation ---------- //

    if (
        !dateEvaluation ||
        note === undefined ||
        isNaN(employeId)
    ) {
        return res.status(400).json({
            message: "La date, la note et l'employé sont obligatoires."
        });
    }

    if (note < 0 || note > 20) {
        return res.status(400).json({
            message: "La note doit être comprise entre 0 et 20."
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

        // ---------- Création ---------- //

        const evaluation = await prisma.evaluation.create({

            data: {

                dateEvaluation,

                note,

                commentaire,

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

        return res.status(201).json({
            message: "Évaluation créée avec succès.",
            evaluation,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}

// --------------------------------------------------------
// Lister toutes les évaluations
// --------------------------------------------------------

export async function listerEvaluations(req: Request, res: Response) {

    try {

        const evaluations = await prisma.evaluation.findMany({

            include: {
                employe: true,
            },

        });

        return res.status(200).json(evaluations);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}

// --------------------------------------------------------
// Trouver une évaluation par ID
// --------------------------------------------------------

export async function evaluationParId(req: Request, res: Response) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    try {

        const evaluation = await prisma.evaluation.findUnique({

            where: {
                id,
            },

            include: {
                employe: true,
            },

        });

        if (!evaluation) {
            return res.status(404).json({
                message: "Évaluation introuvable."
            });
        }

        return res.status(200).json(evaluation);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}

// --------------------------------------------------------
// Modifier une évaluation
// --------------------------------------------------------

export async function modifierEvaluation(req: Request, res: Response) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    const {
        dateEvaluation,
        note,
        commentaire,
    } = req.body;

    const employeId = Number(req.body.employeId);

    if (
        !dateEvaluation ||
        note === undefined ||
        isNaN(employeId)
    ) {
        return res.status(400).json({
            message: "La date, la note et l'employé sont obligatoires."
        });
    }

    if (note < 0 || note > 20) {
        return res.status(400).json({
            message: "La note doit être comprise entre 0 et 20."
        });
    }

    try {

        const evaluation = await prisma.evaluation.findUnique({
            where: {
                id,
            },
        });

        if (!evaluation) {
            return res.status(404).json({
                message: "Évaluation introuvable."
            });
        }

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

        const evaluationModifiee = await prisma.evaluation.update({

            where: {
                id,
            },

            data: {

                dateEvaluation,

                note,

                commentaire,

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

        return res.status(200).json({
            message: "Évaluation modifiée avec succès.",
            evaluation: evaluationModifiee,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}

// --------------------------------------------------------
// Supprimer une évaluation
// --------------------------------------------------------

export async function supprimerEvaluation(req: Request, res: Response) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    try {

        const evaluation = await prisma.evaluation.findUnique({
            where: {
                id,
            },
        });

        if (!evaluation) {
            return res.status(404).json({
                message: "Évaluation introuvable."
            });
        }

        await prisma.evaluation.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            message: "Évaluation supprimée avec succès."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}