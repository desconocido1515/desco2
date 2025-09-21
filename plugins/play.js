import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Capturar errores globales para que el bot no se caiga
process.on('unhandledRejection', (reason, promise) => {
  console.warn('⚠️ Unhandled Rejection capturado:', reason);
});

// Función para obtener audio
const getAudioUrl = async (videoUrl) => {
  try {
    // Intentar ytdl-core
    const tempFile = path.join('/tmp', `${Date.now()}.mp3`);
    const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(tempFile);
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    return { audioUrl: tempFile, api: 'ytdl-core' };
  } catch (err) {
    console.warn(`⚠️ ytdl-core falló: ${err.message}, usando Delirius API`);
    // Respaldo con Delirius API
    const apiUrl = `https://delirius-apiofc.vercel.app/download/spotifydl?url=${encodeURIComponent(videoUrl)}`;
    const { data } = await axios.get(apiUrl, { timeout: 15000 });
    if (!data?.url) throw new Error('Delirius API falló');
    return { audioUrl: data.url, api: 'Delirius API' };
  }
};

// Handler principal
const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ Envía el nombre de la canción\nEj: ${usedPrefix + command} Bad Bunny - Monaco`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar video en YouTube
    const searchResults = await yts({ query: text.trim(), hl: 'es', gl: 'ES' });
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontró ningún video");
    if (video.seconds > 600) throw "❌ El audio es muy largo (máx 10 minutos)";

    // Obtener audio
    const { audioUrl, api } = await getAudioUrl(video.url);
    console.log(`Audio obtenido usando: ${api}`);

    // Enviar info del video
    await conn.sendMessage(m.chat, {
      text: `🪼 *Título:* ${video.title}\n🪩 *Canal:* ${video.author.name}\n⏳ *Duración:* ${video.timestamp}\n🔗 *Enlace:* ${video.url}`,
      contextInfo: {
        externalAdReply: {
          title: video.title.slice(0, 60),
          body: video.author.name,
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: video.url
        }
      }
    }, { quoted: m });

    // Enviar audio
    const audioMessage = fs.existsSync(audioUrl)
      ? { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${video.title.slice(0,30)}.mp3`, ptt: false }
      : { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${video.title.slice(0,30)}.mp3`, ptt: false };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });

    // Eliminar archivo temporal si existe
    if (fs.existsSync(audioUrl) && api === 'ytdl-core') fs.unlink(audioUrl, () => {});

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error handler música:", error?.message || error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    const errorMsg = typeof error === 'string' ? error :
      `❌ *Error:* ${error.message || 'Ocurrió un problema'}\n🔸 Intenta con otra canción o más tarde`;
    await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
  }
};

handler.command = ['play', 'playaudio', 'ytmusic', 'youtube'];
handler.exp = 0;
export default handler;
