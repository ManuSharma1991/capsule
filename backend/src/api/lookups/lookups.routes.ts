import { Router } from 'express';

const lookupsRoutes = Router();

/**
 * @swagger
 * /api/lookups:
 *   get:
 *     summary: Placeholder for retrieving lookup data. (Not yet implemented)
 *     tags:
 *       - Lookups
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
 *                   example: Lookups API is a placeholder.
 */
lookupsRoutes.get('/', (req, res) => {
    res.status(200).json({ message: 'Lookups API is a placeholder.' });
});

export default lookupsRoutes;
