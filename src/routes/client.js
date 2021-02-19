import { Router } from 'express';
import clientController from '../controllers/clientController';

const router = Router();

router.get('/', clientController.testss);

export default router;
