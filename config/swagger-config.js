exports = module.exports = function(app) {
  const swaggerJsDoc = require("swagger-jsdoc");
  const swaggerUi = require("swagger-ui-express");

  // Extended: https://swagger.io/specification/#info-object
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Todo List API",
        description: "API for Todo List made by Nndou",
        contact: {
          name: "Todo List Api (yp.niu.dev@gmail.com)"
        },
        servers: ["http://localhost:5000"],
        basePath: "/api",
        schemes: ["https"]
      }
    },
    apis: ["./routes/*.js"]
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
