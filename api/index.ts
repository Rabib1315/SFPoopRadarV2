import { createServer } from '@vercel/node';
import app from '../server/index';

export default createServer(app); 