// swaggerConfig.js (or add this object to your server file)
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Your Project API', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'API documentation for your React+Express project using SQLite.', // Description
    },
    servers: [
      {
        url: 'http://localhost:10000/api', // The base URL for your API routes (adjust port if different)
        description: 'Development server',
      },
      // Add other servers like staging, production here later
    ],
    components: {
      securitySchemes: {
        // Define security schemes (e.g., JWT) if you plan to use them
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Error message details',
            },
            stack: {
              type: 'string',
              description: 'Stack trace (only in development)',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            },
            username: {
              type: 'string',
              example: 'testuser',
            },
            role: {
              type: 'string',
              example: 'user',
            },
          },
        },
        CasePayload: {
          type: 'object',
          required: ['caseName', 'caseType', 'status'],
          properties: {
            caseName: {
              type: 'string',
              example: 'Example Case Name',
            },
            caseType: {
              type: 'string',
              example: 'Civil',
            },
            status: {
              type: 'string',
              example: 'Open',
            },
            description: {
              type: 'string',
              example: 'Detailed description of the case.',
            },
            // Add other relevant case fields as needed
          },
        },
        Case: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            },
            caseId: {
              type: 'string',
              example: 'CASE-001',
            },
            caseName: {
              type: 'string',
              example: 'Example Case Name',
            },
            caseType: {
              type: 'string',
              example: 'Civil',
            },
            status: {
              type: 'string',
              example: 'Open',
            },
            description: {
              type: 'string',
              example: 'Detailed description of the case.',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-27T10:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-27T11:00:00Z',
            },
          },
        },
      },
    },
  },
  // Paths to files containing OpenAPI definitions (JSDoc comments)
  apis: [
    './src/server.ts', // For health check
    './src/api/auth/auth.routes.ts',
    './src/api/cases/cases.routes.ts',
    './src/api/import/import.routes.ts',
    './src/api/hearings/hearings.routes.ts',
    './src/api/lookups/lookups.routes.ts',
    './src/api/reports/reports.routes.ts',
    './src/api/staging/staging.routes.ts',
  ],
};
