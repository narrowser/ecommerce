import express from 'express';
import cors from 'cors';
import routes from './routes';
import { config } from './config';
import { AppError } from '@ecommerce/shared';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) return res.status(err.statusCode).json({ success: false, error: err.message });
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});
app.listen(config.port, () => console.log(`Product service running on port ${config.port}`));
