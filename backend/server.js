const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const errorHandler = require('./middlewares/error');

// Charger les variables d'environnement
dotenv.config({ path: './config.env' });

// Connecter à la base de données
connectDB();

// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes'); // Nouvelle importation

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logger dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4200' // tu peux ajouter d'autres ports ici si besoin
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

// Monter les routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Nouvelle route pour les produits

// Middleware de gestion d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(`Serveur en marche en mode ${process.env.NODE_ENV} sur le port ${PORT}`)
);

// Gérer les rejets de promesses non gérées
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erreur: ${err.message}`);
  // Fermer le serveur & quitter le processus
  server.close(() => process.exit(1));
});