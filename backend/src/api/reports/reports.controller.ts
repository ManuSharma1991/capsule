import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { exportCauselistToExcel } from './reports.service';

export const generateCauselistReport = async (req: Request, res: Response) => {
  try {
    const { causelistCases } = req.body;

    if (!causelistCases || !Array.isArray(causelistCases)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid request body. "causelistCases" must be an array.',
      });
    }

    const filepath = await exportCauselistToExcel(causelistCases);

    res.status(StatusCodes.OK).json({
      message: 'Excel file generated successfully.',
      filepath,
    });
  } catch (error) {
    console.error('Error generating causelist report:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to generate Excel file.',
    });
  }
};
