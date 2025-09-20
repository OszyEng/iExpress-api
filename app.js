const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

dotenv.config();

const app = express();
app.use(express.json());
const swaggerDocument = yaml.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//-------------------RUTAS-------------------------

const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const followRoutes = require('./routes/follows');
const postRoutes = require('./routes/posts');

app.use('/users', userRoutes);
app.use('/follow', followRoutes);
app.use('/posts', postRoutes);
app.use('/session', sessionRoutes);
app.use((req, res) => {
res.status(404).json({ error: 'Route not found' });
});

//-------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});