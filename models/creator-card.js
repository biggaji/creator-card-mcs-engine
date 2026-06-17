const { ModelSchema, DatabaseModel, SchemaTypes } = require('@app-core/mongoose');

const modelName = 'creatorCards';

const schemaConfig = {
  _id: { type: SchemaTypes.ULID },
  slug: { type: SchemaTypes.String, unique: true, index: true },
  title: { type: SchemaTypes.String },
  description: { type: SchemaTypes.String },
  creator_reference: { type: SchemaTypes.String },
  links: [{ title: { type: SchemaTypes.String }, url: { type: SchemaTypes.String } }],
  service_rates: {
    currency: { type: SchemaTypes.String },
    rates: [
      {
        name: { type: SchemaTypes.String },
        description: { type: SchemaTypes.String },
        amount: { type: SchemaTypes.Number },
      },
    ],
  },
  status: { type: SchemaTypes.String },
  access_type: { type: SchemaTypes.String },
  access_code: { type: SchemaTypes.String },
  created: { type: SchemaTypes.Number },
  updated: { type: SchemaTypes.Number },
  deleted: { type: SchemaTypes.Number, default: null },
};

const modelSchema = new ModelSchema(schemaConfig, { collection: modelName });

module.exports = DatabaseModel.model(modelName, modelSchema);
