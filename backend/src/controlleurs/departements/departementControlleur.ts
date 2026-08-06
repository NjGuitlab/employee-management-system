import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";


//-----------------------------------------
// Créer un nouveau département
//-----------------------------------------

export async function creerDepartement(req: Request, res: Response) {

    const { nom, description } = req.body;

    if (!nom) {
        return res.status(400).json({ message: "Un nom de département est obligatoire." });
    }

    try {
        const departementExistant = await prisma.departement.findUnique({
            where: {
                nom,
            }
        })

        if (departementExistant) {
            return res.status(409).json({ message: "Un département avec le meme nom existe deja." })
        }

        const departement = await prisma.departement.create({
            data: {
                nom,
                description
            }
        })

        return res.status(201).json(departement);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });

    }

}


//---------------------------------------------------
// Lister les départements
//---------------------------------------------------

export async function listeDepartements(req: Request, res: Response) {

    try {
        const departements = await prisma.departement.findMany();

        if (departements.length === 0) {

            return res.status(404).json({ message: "Aucun département trouvé." });
        }

        return res.status(200).json(departements);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne de Serveur." })
    }
}

//---------------------------------------------------
// Trouver un département par Id
//---------------------------------------------------

export async function departementParId(req: Request, res: Response) {

    const id = Number(req.params.id);


    try {
        const departement = await prisma.departement.findUnique({
            where: {
                id,
            }
        }
        );

        if (!departement) {

            return res.status(404).json({ message: "Aucun département trouvé." });
        }

        return res.status(200).json(departement);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne de Serveur." })
    }
}


// --------------------------------------------------------
// Modifier un département
// --------------------------------------------------------

export async function modifierDepartement(req: Request, res: Response) {

    // ---------- Validation ---------- //

    const id = Number(req.params.id);

    const { nouveauNom } = req.body;

    if (!nouveauNom) {
        return res.status(400).json({
            message: "Le nouveau nom est obligatoire."
        });
    }

    try {

        // ---------- Modifier le département ---------- //

        const departementMisAJour = await prisma.departement.update({
            where: {
                id,
            },
            data: {
                nom: nouveauNom,
            },
        });

        // ---------- Réponse ---------- //

        return res.status(200).json({
            id: departementMisAJour.id,
            nom: departementMisAJour.nom,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}


// --------------------------------------------------------
// Supprimer un département
// --------------------------------------------------------

export async function supprimerDepartement(req: Request, res: Response) {

    const id = Number(req.params.id);

    try {

        const departement = await prisma.departement.findUnique({
            where: { id },
        });

        if (!departement) {
            return res.status(404).json({
                message: "Département introuvable."
            });
        }

        await prisma.departement.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Département supprimé avec succès."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}