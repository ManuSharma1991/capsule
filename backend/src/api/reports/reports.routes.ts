import { Router } from 'express';
import { tryCatchWrapper } from '../../utils/helpers';

const reportsRoutes = Router();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Placeholder for retrieving reports. (Not yet implemented)
 *     tags:
 *       - Reports
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
 *                   example: Reports API is a placeholder.
 */
reportsRoutes.get('/', tryCatchWrapper((req, res) => {
    res.status(200).json({ message: 'Reports API is a placeholder.' });
}));

export default reportsRoutes;
