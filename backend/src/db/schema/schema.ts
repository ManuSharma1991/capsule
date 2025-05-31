import * as mainSchema from './main';
// import * as stagingSchema from './staging';
// Potentially other shared schemas if any

export const schema = {
  ...mainSchema,
  //   ...stagingSchema,
  // ...any other schemas
};

// Or if you prefer to export them separately:
// export { mainSchema, stagingSchema };