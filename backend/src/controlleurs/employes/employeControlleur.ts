import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";

// --------------------------------------------------------
// Créer un nouvel employé
// --------------------------------------------------------

export async function creerEmploye(req: Request, res: Response) {

    // ---------- Récupération des données ---------- //

    const {
        nom,
        prenom,
        emailPro,
        telephone,
        salaire,
        dateEmbauche,
    } = req.body;

    // Conversion des identifiants en nombre
    const posteId = Number(req.body.posteId);
    const departementId = Number(req.body.departementId);

    // ---------- Validation des données ---------- //

    if (
        !nom ||
        !prenom ||
        !emailPro ||
        !dateEmbauche ||
        isNaN(posteId) ||
        isNaN(departementId)
    ) {
        return res.status(400).json({
            message: "Nom, prénom, email, date d'embauche, poste et département sont obligatoires."
        });
    }

    try {

        // ---------- Vérifier que l'email n'est pas déjà utilisé ---------- //

        const employeExistant = await prisma.employe.findUnique({
            where: {
                emailPro,
            },
        });

        if (employeExistant) {
            return res.status(409).json({
                message: "Un employé avec cet email existe déjà."
            });
        }

        // ---------- Vérifier que le poste existe ---------- //

        const poste = await prisma.poste.findUnique({
            where: {
                id: posteId,
            },
        });

        if (!poste) {
            return res.status(404).json({
                message: "Le poste sélectionné n'existe pas."
            });
        }

        // ---------- Vérifier que le département existe ---------- //

        const departement = await prisma.departement.findUnique({
            where: {
                id: departementId,
            },
        });

        if (!departement) {
            return res.status(404).json({
                message: "Le département sélectionné n'existe pas."
            });
        }

        // ---------- Création de l'employé ---------- //

        const employe = await prisma.employe.create({

            data: {

                nom,
                prenom,
                emailPro,
                telephone,
                salaire,
                dateEmbauche,

                // Association avec le poste
                poste: {
                    connect: {
                        id: posteId,
                    },
                },

                // Association avec le département
                departement: {
                    connect: {
                        id: departementId,
                    },
                },
            },

            // Retourner également les informations liées
            include: {
                poste: true,
                departement: true,
            },
        });

        // ---------- Réponse ---------- //

        return res.status(201).json({
            message: "Employé créé avec succès.",
            employe,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}

// --------------------------------------------------------
// Lister tous les employés
// --------------------------------------------------------

export async function listerEmployes(req: Request, res: Response) {

    try {

        // Récupérer tous les employés avec leur poste et leur département
        const employes = await prisma.employe.findMany({

            include: {
                poste: true,
                departement: true,
            },

        });

        return res.status(200).json(employes);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}


//------------------------------------
// Employe par ID
//------------------------------------

export async function employeParId(req: Request, res: Response) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    try {
        const employe = await prisma.employe.findUnique({
            where: {
                id,
            },
            include: {
                poste: true,
                departement: true,
            },
        })

        if (!employe) {
            return res.status(404).json({
                message: "Employé introuvable."
            });
        }

        return res.status(200).json(employe);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }

}



//------------------------------------
// Supprimer un employé 
//------------------------------------

export async function supprimerEmploye(req: Request, res: Response) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    try {
        const employe = await prisma.employe.findUnique({
            where: {
                id,
            }
        })

        if (!employe) {
            return res.status(404).json({ message: "Employé introuvable." });
        }

        await prisma.employe.delete({
            where: {
                id,
            }

        })

        return res.status(200).json({
            message: "Employé supprimé avec succès."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }

}


// --------------------------------------------------------
// Modifier un employé
// --------------------------------------------------------

export async function modifierEmploye(req: Request, res: Response) {

    // ---------- Récupération de l'identifiant ---------- //

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    // ---------- Récupération des données ---------- //

    const {
        nom,
        prenom,
        telephone,
        salaire,
        dateEmbauche,
    } = req.body;

    // Conversion des identifiants en nombre
    const posteId = Number(req.body.posteId);
    const departementId = Number(req.body.departementId);

    // ---------- Validation des données ---------- //

    if (
        !nom ||
        !prenom ||
        !dateEmbauche ||
        isNaN(posteId) ||
        isNaN(departementId)
    ) {
        return res.status(400).json({
            message: "Nom, prénom, date d'embauche, poste et département sont obligatoires."
        });
    }

    try {

        // ---------- Vérifier que l'employé existe ---------- //

        const employe = await prisma.employe.findUnique({
            where: {
                id,
            },
        });

        if (!employe) {
            return res.status(404).json({
                message: "Employé introuvable."
            });
        }

        // ---------- Vérifier que le poste existe ---------- //

        const poste = await prisma.poste.findUnique({
            where: {
                id: posteId,
            },
        });

        if (!poste) {
            return res.status(404).json({
                message: "Le poste sélectionné n'existe pas."
            });
        }

        // ---------- Vérifier que le département existe ---------- //

        const departement = await prisma.departement.findUnique({
            where: {
                id: departementId,
            },
        });

        if (!departement) {
            return res.status(404).json({
                message: "Le département sélectionné n'existe pas."
            });
        }

        // ---------- Mise à jour de l'employé ---------- //

        const employeMisAJour = await prisma.employe.update({

            where: {
                id,
            },

            data: {

                nom,
                prenom,
                telephone,
                salaire,
                dateEmbauche,

                // Mise à jour du poste
                poste: {
                    connect: {
                        id: posteId,
                    },
                },

                // Mise à jour du département
                departement: {
                    connect: {
                        id: departementId,
                    },
                },
            },

            // Retourner également les informations liées
            include: {
                poste: true,
                departement: true,
            },

        });

        // ---------- Réponse ---------- //

        return res.status(200).json(employeMisAJour);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}