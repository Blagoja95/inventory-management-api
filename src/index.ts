import 'dotenv/config'
import express from 'express';

import errorHandler from './errors/ErrorHandlingMiddleware';
import inventoryRouter from './routes/InventoryRoutes';
import documentationRouter from './routes/DocumentationRoute';

const PORT = process.env.NODE_PORT || 5000;

const app = express();

app.use(express.json());

app.use(inventoryRouter);
app.use(documentationRouter);

app.use(errorHandler);
app.listen(PORT, () => console.info(`Server listening on port: ${PORT}`));