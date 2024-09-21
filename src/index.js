const express = require('express');
const dotenv = require('dotenv')
    .config();

const HOSTNAME = process.env.NODE_HOSTNAME || '127.0.0.1';
const PORT = process.env.NODE_PORT || 5000;

const app = express();
const errorHandler = require('./errors/ErrorHandlingMiddleware');
const inventoryRouter = require('./routes/InventoryRoutes');

app.use(express.json());

app.use(inventoryRouter);

app.use(errorHandler);

app.listen(PORT, HOSTNAME, () => console.info(`Server listening on: http://${HOSTNAME}:${PORT}`));