import { Router} from 'express';
import rt from "./InventoryRoutes";

const ut = Router();


ut.get('/v1/users/get/users`');
ut.get('/v1/users/get/users/namet/:name');
ut.get('/v1/users/get/users/:id');

ut.post('/v1/users/register');
ut.put('/v1/users/login');

ut.put('/v1/users/update');

ut.delete('/v1/users/delete');