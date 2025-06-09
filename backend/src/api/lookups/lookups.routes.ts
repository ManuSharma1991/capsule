import { Router } from 'express';
import lookupsController from './lookups.controller';

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

/**
 * @swagger
 * /api/lookups/casesByHearingDate:
 *   get:
 *     summary: Fetch case data based on hearing date.
 *     tags:
 *       - Lookups
 *     parameters:
 *       - in: query
 *         name: hearingDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The hearing date in YYYY-MM-DD format.
 *     responses:
 *       200:
 *         description: Successfully retrieved case data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   caseNumber:
 *                     type: string
 *                   hearingDate:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Invalid hearing date format.
 *       500:
 *         description: Internal server error.
 */
lookupsRoutes.get('/casesByHearingDate', lookupsController.getCasesByHearingDate);

export default lookupsRoutes;
