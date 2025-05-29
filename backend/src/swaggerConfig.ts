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
        url: 'http://localhost:3000/api', // The base URL for your API routes (adjust port if different)
        description: 'Development server',
      },
      // Add other servers like staging, production here later
    ],
    components: {
        securitySchemes: { // Define security schemes (e.g., JWT) if you plan to use them
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    }
  },
  // Paths to files containing OpenAPI definitions (JSDoc comments)
  apis: [
    './routes/*.js', // Look for comments in all .js files in the 'routes' directory
    // Add other paths if your routes/controllers are elsewhere, e.g., './controllers/*.js'
    // './models/*.js' // Sometimes schemas are defined near models
  ],
};
