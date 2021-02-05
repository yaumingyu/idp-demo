import { Router } from 'express';

const router = Router();

/* GET users listing. */
// eslint-disable-next-line no-unused-vars
router.get('/', (_req, res, _next) => {
  res.send('respond with a resource');
});

export default router;
