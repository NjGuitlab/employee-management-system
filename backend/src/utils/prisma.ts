import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client.js";
import dotenv from "dotenv";

// --------------------------------------------------------
// Chargement des variables d'environnement (.env)
// --------------------------------------------------------

dotenv.config();

// --------------------------------------------------------
// Création de l'adapter Neon
// Permet à Prisma de communiquer avec la base PostgreSQL
// hébergée sur Neon.
// --------------------------------------------------------

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
});

// --------------------------------------------------------
// Création d'une instance unique de Prisma
// Cette instance sera utilisée dans toute l'application
// pour effectuer les requêtes vers la base de données.
// --------------------------------------------------------

const prisma = new PrismaClient({
    adapter,

    // Affiche les informations utiles dans le terminal
    // pendant le développement.
    log: ["query", "info", "warn", "error"],
});

// --------------------------------------------------------
// Export de l'instance Prisma
// Permet de l'importer dans tous les contrôleurs.
// Exemple : import prisma from "../utils/prisma.js"
// --------------------------------------------------------

export default prisma;