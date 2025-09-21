import yts from 'yt-search';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ 𝘌𝘯𝘷𝘪𝘢 𝘦𝘭 𝘯𝘰𝘮𝘣𝘳𝘦 𝘥𝘦 𝘭𝗮 𝗰𝗮𝗻𝗰𝗶𝗼́𝗻\n\n» 𝘌𝘫𝗲𝗺𝗽𝗹𝗼: ${usedPrefix + command} Bad Bunny - Monaco`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar video en YouTube
    const searchResults = await yts({ query: text.trim(), hl: 'es', gl: 'ES' });
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontró ningún video");

    // Limitar duración (máx 10 min)
    if (video.seconds > 600) throw "❌ El audio es muy largo (máx 10 minutos)";

    // Info del video
    const infoText = `🪼 *Título:* ${video.title}\n🪩 *Canal:* ${video.author.name}\n⏳ *Duración:* ${video.timestamp}\n🔗 *Enlace:* ${video.url}`;

    await conn.sendMessage(m.chat, {
      text: infoText,
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

    // Descargar audio con ytdl-core
    const tempFile = path.join('/tmp', `${video.videoId}.mp3`);
    const stream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });
    
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(tempFile);
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Enviar audio
    await conn.sendMessage(m.chat, {
      audio: { url: tempFile },
      mimetype: 'audio/mpeg',
      fileName: `${video.title.slice(0, 30)}.mp3`.replace(/[^\w\s.-]/gi, ''),
      ptt: false
    }, { quoted: m });

    // Eliminar archivo temporal
    fs.unlink(tempFile, (err) => err && console.error('Error al borrar temp:', err));

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error handler YouTube:", error?.message || error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

    const errorMsg = typeof error === 'string' ? error :
      `❌ *Error:* ${error.message || 'Ocurrió un problema'}\n\n` +
      `🔸 *Posibles soluciones:*\n` +
      `• Verifica el nombre de la canción\n` +
      `• Intenta con otro tema\n` +
      `• Prueba más tarde`;

    await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
  }
};

handler.command = ['play', 'playaudio', 'ytmusic', 'youtube'];
handler.exp = 0;
export default handler;
