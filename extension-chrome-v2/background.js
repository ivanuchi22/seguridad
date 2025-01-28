const API_KEY = '28a8d569bab3e2283e9bfbc333b8112b2d8900e5b28c523b028c5af7cd0c6dbb'; // Sustituye con tu clave de API de VirusTotal

// Función para codificar la URL en base64
function encodeUrl(url) {
  return btoa(url);
}

// Verifica si una URL es maliciosa usando VirusTotal
async function checkUrlWithVirusTotal(url) {
  const encodedUrl = encodeUrl(url);
  const apiUrl = `https://www.virustotal.com/api/v3/urls/${encodedUrl}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-apikey': API_KEY,
      },
    });

    if (response.ok) {
        try {
          const data = await response.json();
  
          // Verificar si los campos necesarios existen en el JSON
          if (
            data &&
            data.data &&
            data.data.attributes &&
            data.data.attributes.last_analysis_stats &&
            typeof data.data.attributes.last_analysis_stats.malicious === 'number'
          ) {
            const malicious = data.data.attributes.last_analysis_stats.malicious;
            return malicious > 0; // Retorna true si la URL es maliciosa
          } else {
            console.warn('El campo "malicious" no está presente o no es válido.');
            console.log('Respuesta del análisis:', JSON.stringify(data, null, 2));
            return false;
          }
        } catch (jsonError) {
          console.error('Error al procesar el JSON:', jsonError);
          return false;
        }
      } else {
        console.info('No se ha encontrado información de esta url:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error en la solicitud a VirusTotal:', error);
      return false;
    }
  }


  // Escucha eventos de navegación y escanea URLs
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const isMalicious = await checkUrlWithVirusTotal(changeInfo.url);

    if (isMalicious) {
      console.warn(`URL maliciosa detectada y bloqueada: ${changeInfo.url}`);

      // Crea una regla dinámica para bloquear la URL
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: Math.floor(Math.random() * 100000), // ID único
            priority: 1,
            action: { type: "block" },
            condition: { urlFilter: changeInfo.url },
          },
        ],
        removeRuleIds: [],
      });

      // Opcional: Redirige al usuario a una página bloqueada
      chrome.tabs.update(tabId, { url: `blocked.html?url=${encodeURIComponent(changeInfo.url)}` });
      //chrome.tabs.update(tabId, { url: "blocked.html" });
    }
  }
});
