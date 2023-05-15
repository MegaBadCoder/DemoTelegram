// import { Pool } from 'pg';
import { Sequelize } from 'sequelize';
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'se_little_bot',
//     password: 'Dgvwre7i!',
//     port: 5432,
// })

const databaseConfig = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'se_little_bot',
  username: 'postgres',
  password: 'Dgvwre7i!',
  timezone: '+00:00',
  logging: console.log,
  define: {
    // timestamps: false,
    freezeTableName: true,
  }
});

// databaseConfig.addModels([User]);

export default databaseConfig;