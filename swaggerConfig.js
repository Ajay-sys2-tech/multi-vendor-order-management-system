const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation for Multi-Vendor Order Management System',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'User', description: 'User endpoints' },
      { name: 'Product', description: 'Product management' },
      { name: 'Cart', description: 'Shopping cart operations' },
      { name: 'Order', description: 'Order management' },
      { name: 'Analytics', description: 'Vendor analytics and reporting' },
      { name: 'AdminAnalytics', description: 'Admin-level insights' },
    ],
  },
  apis: ['./routes/*.js'], // Update path as needed
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
