import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";

// --------------------------------------------------------
// Créer un nouveau poste
// --------------------------------------------------------

export async function creerPoste(req: Request, res: Response) {

    // ---------- Validation ---------- //

    const { nom, description } = req.body;

    if (!nom) {
        return res.status(400).json({
            message: "Le nom du poste est obligatoire."
        });
    }

    try {

        // ---------- Vérifier si le poste existe ---------- //

        const posteExistant = await prisma.poste.findUnique({
            where: {
                nom,
            },
        });

        if (posteExistant) {
            return res.status(409).json({
                message: "Un poste avec ce nom existe déjà."
            });
        }

        // ---------- Créer le poste ---------- //

        const poste = await prisma.poste.create({
            data: {
                nom,
                description,
            },
        });

        // ---------- Réponse ---------- //

        return res.status(201).json(poste);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}


// -----------------------------------------
// Lister les postes 
// -----------------------------------------

export async function listerPostes(req:Request, res:Response) {

    try {

        const postes = await prisma.poste.findMany();

        return res.status(200).json(postes);

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Erreur interne du serveur."});
    }
    
}

// -----------------------------------------
// Trouver un poste par Id
// -----------------------------------------

export async function posteParId(req:Request, res:Response) {

    const id = Number(req.params.id);

    try {

        const poste = await prisma.poste.findUnique({
            where:{
                id,
            }
        });

        if(!poste){
            return res.status(404).json({message:"Poste introuvable."})
        }

        return res.status(200).json(poste);

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Erreur interne du serveur."});
    }
    
}

//--------------------------------------------
// Modifier un poste
//--------------------------------------------

export async function modifierPoste(req: Request, res: Response) {

    const id = Number(req.params.id);

    const { nom, description } = req.body;

    if (!nom) {
        return res.status(400).json({
            message: "Le nom est obligatoire."
        });
    }

    try {

        const poste = await prisma.poste.findUnique({
            where: {
                id,
            },
        });

        if (!poste) {
            return res.status(404).json({
                message: "Poste introuvable."
            });
        }

        const posteMisAJour = await prisma.poste.update({
            where: {
                id,
            },
            data: {
                nom,
                description,
            },
        });

        return res.status(200).json(posteMisAJour);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
}



// -----------------------------------------
// Supprimer un poste
// -----------------------------------------

export async function supprimerPoste(req:Request, res:Response) {

    const id = Number(req.params.id);

    try {

        const poste = await prisma.poste.findUnique({
            where:{
                id,
            }
        });

        if(!poste){
            return res.status(404).json({message:"Poste introuvable."})
        }

        await prisma.poste.delete({
            where:{id}
        })

        return res.status(200).json({message:"Poste supprimé."});

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Erreur interne du serveur."});
    }
    
}