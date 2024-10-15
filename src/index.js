const express = require('express');
require('dotenv').config();

const PORT = process.env.NODE_PORT || 5000;

const app = express();
const errorHandler = require('./errors/ErrorHandlingMiddleware');

const inventoryRouter = require('./routes/InventoryRoutes');
const documentationRouter = require('./routes/DocumentationRoute');

app.use(express.json());

app.use(inventoryRouter);
app.use(documentationRouter);

app.use(errorHandler);
app.listen(PORT, () => console.info(`Server listening on port: ${PORT}`));