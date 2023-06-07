import { Request, Response, NextFunction } from 'express';

const validateAuth = (req: Request, res: Response, next: NextFunction) : void => {
    if (req.isAuthenticated()) { console.log("user is authenticated"); return next(); }
    console.log("user is not authenticated");
    res.redirect('/auth/login');
}

export default validateAuth;