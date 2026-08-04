import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --------------------------------------------------------
// Inscription d'un utilisateur
// --------------------------------------------------------

export async function authInscription(req: Request, res: Response) {

    // ---------- Validation des données ---------- //

    const { email, motDePasse, nom, prenom } = req.body;

    if (!email || !motDePasse || !nom || !prenom) {
        return res.status(400).json({
            message: "Informations requises : courriel, mot de passe, nom et prénom."
        });
    }

    try {

        // ---------- Vérifier si l'utilisateur existe ---------- //

        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email },
        });

        if (utilisateur) {
            return res.status(409).json({
                message: "Un compte existe avec ce courriel. Veuillez choisir une autre adresse."
            });
        }

        // ---------- Hasher le mot de passe ---------- //

        const mdpHash = await bcrypt.hash(motDePasse, 10);

        // ---------- Créer l'utilisateur ---------- //

        const nouvelUtilisateur = await prisma.utilisateur.create({
            data: {
                email,
                motDePasse: mdpHash,
                nom,
                prenom,
            },
        });

        // ---------- Réponse ---------- //

        return res.status(201).json({
            id: nouvelUtilisateur.id,
            email: nouvelUtilisateur.email,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur du serveur."
        });

    }
}

// --------------------------------------------------------
// Connexion d'un utilisateur
// --------------------------------------------------------

export async function authConnexion(req: Request, res: Response) {

    // ---------- Validation des données ---------- //

    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        return res.status(400).json({
            message: "Email ou mot de passe manquant."
        });
    }

    try {

        // ---------- Rechercher l'utilisateur ---------- //

        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email },
        });

        if (!utilisateur) {
            return res.status(401).json({
                message: "Identifiants invalides."
            });
        }

        // ---------- Vérifier le mot de passe ---------- //

        const motDePasseValide = await bcrypt.compare(
            motDePasse,
            utilisateur.motDePasse
        );

        if (!motDePasseValide) {
            return res.status(401).json({
                message: "L'authentification a échoué."
            });
        }

        // ---------- Générer le JWT ---------- //

        const token = jwt.sign(
            {
                sub: utilisateur.id,
                role: utilisateur.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h",
            }
        );

        // ---------- Réponse ---------- //

        return res.status(200).json({
            token,
        });

    } catch (error) {

        // ---------- Erreurs Prisma connues ---------- //

        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            console.error(`Prisma Error (${error.code}) : ${error.message}`);

            switch (error.code) {

                case "P2025":
                    return res.status(404).json({
                        message: "La ressource demandée est introuvable."
                    });

                default:
                    return res.status(500).json({
                        message: "Une erreur de base de données est survenue."
                    });
            }
        }

        // ---------- Erreurs de validation Prisma ---------- //

        if (error instanceof Prisma.PrismaClientValidationError) {

            console.error(`Prisma Validation Error : ${error.message}`);

            return res.status(400).json({
                message: "Les données envoyées sont invalides."
            });
        }

        // ---------- Erreur inconnue ---------- //

        console.error(error);

        return res.status(500).json({
            message: "Une erreur interne est survenue."
        });
    }
}