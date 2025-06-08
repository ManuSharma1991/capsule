import { Router } from 'express';

const hearingsRoutes = Router();

/**
 * @swagger
 * /api/hearings:
 *   get:
 *     summary: Placeholder for retrieving hearings. (Not yet implemented)
 *     tags:
 *       - Hearings
 *     responses:
 *       200:
 *         description: Returns a placeholder message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hearings API is a placeholder.
 */
hearingsRoutes.get('/', (req, res) => {
    res.status(200).json({ message: 'Hearings API is a placeholder.' });
});

export default hearingsRoutes;
