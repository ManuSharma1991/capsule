import { Router } from 'express';
import { addCase, getCases } from './cases.controller';
import { tryCatchWrapper } from '../../utils/helpers';

const caseRoutes = Router();

/**
 * @swagger
 * /api/cases/addCase:
 *   post:
 *     summary: Add a new case.
 *     tags:
 *       - Cases
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasePayload'
 *     responses:
 *       201:
 *         description: Case added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Case added successfully
 *       400:
 *         description: Bad request (e.g., invalid input).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (e.g., missing or invalid token).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
caseRoutes.post('/addCase', tryCatchWrapper(addCase));

/**
 * @swagger
 * /api/cases/getCases:
 *   get:
 *     summary: Retrieve a list of cases.
 *     tags:
 *       - Cases
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for cases.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [caseId, caseName, createdAt]
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order.
 *     responses:
 *       200:
 *         description: A list of cases.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cases:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Case'
 *                 total:
 *                   type: integer
 *                   example: 100
 *       401:
 *         description: Unauthorized (e.g., missing or invalid token).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
caseRoutes.get('/getCases', getCases);

export default caseRoutes;
