import mysql from 'mysql2/promise';

async function testConnection() {
  let connection; // Declara la variable de conexión

  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'applicationuser',
      password: 'applicationuser',
      database: 'movie_db',
      waitForConnections: true,
      ssl: false
    });

    console.log('✅ Connected!');
    
  } catch (error) {
    // Es CRUCIAL capturar y mostrar el error real de la conexión
    console.error('❌ Connection failed:', error.message);
    
  } finally {
    // Asegúrate de cerrar la conexión si se abrió
    if (connection) {
      await connection.end();
    }
  }
}

// Llama a la función principal para iniciar la ejecución
testConnection();