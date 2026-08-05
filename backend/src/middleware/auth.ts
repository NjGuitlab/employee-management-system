import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

// --------------------------------------------------------
// Vérifie que l'utilisateur possède un JWT valide.
// Si le token est valide, les informations de l'utilisateur
// sont ajoutées dans req.utilisateur puis on passe
// au middleware suivant.
// --------------------------------------------------------

function authentificationJWT(
    req: Request,
    res: Response,
    next: NextFunction
) {

    // ---------- Récupérer l'en-tête Authorization ---------- //

    const authHeader = req.get("Authorization");

    // Vérifie que le header existe et qu'il commence par "Bearer "

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token d'authentification absent."
        });
    }

    // ---------- Extraire le token ---------- //

    const token = authHeader.split(" ")[1]!;

    try {

        // ---------- Vérifier le JWT ---------- //
        // Si le token est valide, jwt.verify retourne le payload.

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        // ---------- Sauvegarder le payload ---------- //
        // On pourra ensuite récupérer :
        // req.utilisateur.sub
        // req.utilisateur.role

        (req as any).utilisateur = payload;

        // ---------- Passer au middleware suivant ---------- //

        return next();

    } catch (error) {

        // ---------- Le token a expiré ---------- //

        if (error instanceof jwt.TokenExpiredError) {

            return res.status(401).json({
                message: "Votre session a expiré. Veuillez vous reconnecter."
            });
        }

        // ---------- Le token est invalide ---------- //

        if (error instanceof jwt.JsonWebTokenError) {

            return res.status(401).json({
                message: "Token invalide."
            });
        }

        // ---------- Erreur inconnue ---------- //

        console.error(error);

        return res.status(500).json({
            message: "Une erreur interne est survenue."
        });
    }
}

function niveauRequis(role:string){
    return (req:Request, res:Response, next: NextFunction) =>{
        if((req as any).utilisateur.role !== role){
            return res.status(403).json({message:"acces refusé."})
        }

        next()
    }

}

export { authentificationJWT, niveauRequis }