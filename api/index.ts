<<<<<<< HEAD
import { createServer } from '@vercel/node';
import app from '../server/index';

export default createServer(app); 
=======
import app from '../server/index';

// Export the Express app directly for Vercel's Node runtime
export default app;
>>>>>>> d807cc6 (Initial commit)
