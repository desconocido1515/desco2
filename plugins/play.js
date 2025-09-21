import axios from 'axios';
import yts from 'yt-search';

const SEARCH_API = 'https://delirius-apiofc.vercel.app/search/spotify?q=';
const DL_API = 'https://delirius-apiofc.vercel.app/download/spotifydl?url=';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ 𝘌𝘯𝘷𝘪𝘢 𝘦𝘭 𝘯𝘰𝘮𝘣𝘳𝘦 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪ó𝘯\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix + command} Bad Bunny - Monaco`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar video con yt-search (opcional para info rápida)
    const searchResults = await yts({ query: text.trim(), hl: 'es', gl: 'ES' });
    const video = searchResults.videos[0] || {};
    
    const isSpotifyUrl = /https?:\/\/open\.spotify\.com\/(track|album|playlist|episode)\/[A-Za-z0-9]+/i.test(text);
    let trackUrl = text.trim();
    let picked = null;

    if (!isSpotifyUrl) {
      // Buscar canción en Delirius API
      const { data: sRes } = await axios.get(`${SEARCH_API}${encodeURIComponent(text.trim())}`, { timeout: 25000 });
      if (!sRes?.status || !Array.isArray(sRes?.data) || sRes.data.length === 0) throw new Error('No se encontraron resultados.');
      picked = sRes.data[0];
      trackUrl = picked.url;
    }

    // Descargar audio
    const { data: dRes } = await axios.get(`${DL_API}${encodeURIComponent(trackUrl)}`, { timeout: 25000 });
    if (!dRes?.status || !dRes?.data?.url) throw new Error('No se pudo obtener el enlace de descarga.');

    const {
      title = picked?.title || video.title || 'Desconocido',
      author = picked?.artist || 'Desconocido',
      image = picked?.image || video.thumbnail || '',
      duration = picked?.duration || video.seconds * 1000 || 0,
      url: download
    } = dRes.data || {};

    const toMMSS = (ms) => {
      const totalSec = Math.floor((+ms || 0) / 1000);
      const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const ss = String(totalSec % 60).padStart(2, '0');
      return `${mm}:${ss}`;
    };
    const mmss = duration ? toMMSS(duration) : '—:—';

    // Mensaje con info del audio
    await conn.sendMessage(m.chat, {
      text: `01:27 ━━━━━⬤────── 05:48\n*⇄ㅤ      ◁        ❚❚        ▷        ↻*\n╴𝗘𝗹𝗶𝘁𝗲 𝗕𝗼𝘁 𝗚𝗹𝗼𝗯𝗮𝗹\n\n🪼 *Título:* ${title}\n🪩 *Artista:* ${author}\n⏳ *Duración:* ${mmss}\n🔗 *Enlace:* ${trackUrl}`,
      contextInfo: {
        externalAdReply: {
          title: title.slice(0, 60),
          body: author,
          thumbnailUrl: image,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: trackUrl
        }
      }
    }, { quoted: m });

    // Enviar audio
    await conn.sendMessage(m.chat, {
      audio: { url: download },
      mimetype: "audio/mpeg",
      fileName: `${title.slice(0, 30)}.mp3`.replace(/[^\w\s.-]/gi, ''),
      ptt: false
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error?.message || error);
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

handler.command = ['play', 'playaudio', 'ytmusic', 'spotify', 'music'];
handler.exp = 0;
export default handler;
