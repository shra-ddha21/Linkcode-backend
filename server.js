const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('LMS Backend is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
