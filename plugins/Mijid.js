import fs from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  // Solo permitir en chats privados
  if (m.isGroup) return;

  const sessionId = conn.user?.id?.split(':')[0]; // obtiene el ID del subbot
  if (!sessionId) return m.reply('❌ No se pudo identificar la sesión.');

  const sessionPath = path.join('./GataJadiSession', sessionId); // Ruta de la sesión

  try {
    await m.reply('🧹 Cerrando sesión y eliminando datos...');
    await conn.ws.close(); // Cierra conexión WebSocket

    // Eliminar carpeta de la sesión
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    process.send('reset'); // Reinicia el proceso del subbot (si aplica)
  } catch (e) {
    console.error(e);
    await m.reply('❌ Error al cerrar la sesión.');
  }
};

handler.command = /^cerrar$/i;
handler.private = true; // Solo en chats privados
handler.help = ['cerrar'];
handler.tags = ['jadibot'];
handler.register = true; // Evita que otros lo usen sin ser subbot

export default handler;
