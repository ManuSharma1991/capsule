import { Router } from 'express';

const stagingRoutes = Router();

/**
 * @swagger
 * /api/staging:
 *   get:
 *     summary: Placeholder for retrieving staging data. (Not yet implemented)
 *     tags:
 *       - Staging
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
 *                   example: Staging API is a placeholder.
 */
stagingRoutes.get('/', (req, res) => {
    res.status(200).json({ message: 'Staging API is a placeholder.' });
});

export default stagingRoutes;
