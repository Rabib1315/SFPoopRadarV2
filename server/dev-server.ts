import app from './index';

const port = 4000;
app.listen(port, () => {
  console.log(`Dev server running on http://localhost:${port}`);
}); 