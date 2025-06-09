import { Router } from 'express';
import { tryCatchWrapper } from '../../utils/helpers';
import { importCases } from './import.controller';
import { excelFileToJson } from '../../utils/excelToJson';

const importRoutes = Router();

/**
 * @swagger
 * /api/import/importCauselistData:
 *   post:
 *     summary: Imports case data from an Excel file.
 *     tags:
 *       - Import
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The Excel file to upload.
 *     responses:
 *       200:
 *         description: Data imported successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data imported successfully
 *       400:
 *         description: Bad request (e.g., no file uploaded, invalid file format).
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
importRoutes.post('/importCauselistData', tryCatchWrapper(importCases));

/**
 * @swagger
 * /api/import/convertExcelToJson:
 *   get:
 *     summary: Converts a predefined Excel file (test.xlsx) to JSON. (Development/Testing Only)
 *     tags:
 *       - Import
 *     responses:
 *       200:
 *         description: Excel data converted to JSON successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Represents a row from the Excel sheet.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
importRoutes.get('/convertExcelToJson', async (req, res, next) => {
  console.log('Current Working Directory (CWD):', process.cwd());
  console.log('Directory of this file (__dirname):', __dirname);

  try {
    const data = await excelFileToJson('data.xlsx', {
      sheetNameOrIndex: 0,
      skipBlankRows: true,
      rawValues: true,
      dateNF: 'yyyy-mm-dd',
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default importRoutes;
