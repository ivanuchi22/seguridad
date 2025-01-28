const API_KEY = '28a8d569bab3e2283e9bfbc333b8112b2d8900e5b28c523b028c5af7cd0c6dbb'; // Sustituye con tu clave API de VirusTotal

// Función para codificar la URL en base64
function encodeUrl(url) {
    return btoa(url);
}

// Función para verificar la URL en VirusTotal
async function checkUrl(url) {
    const encodedUrl = encodeUrl(url);
    const apiUrl = `https://www.virustotal.com/api/v3/urls/${encodedUrl}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-apikey': API_KEY
            }
        });

        if (response.ok) {
            const data = await response.json();
            const malicious = data.data.attributes.last_analysis_stats.malicious;
            return malicious > 0 ? "Maliciosa" : "Segura";
        } else {
            console.error('Error al verificar URL:', response.status, response.statusText);
            return "Error al verificar";
        }
    } catch (error) {
        console.error('Error en la solicitud a VirusTotal:', error);
        return "Error en la solicitud";
    }
}

document.getElementById('scan-button').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const result = await checkUrl(tab.url);
    document.getElementById('result').textContent = `Resultado: ${result}`;
});
