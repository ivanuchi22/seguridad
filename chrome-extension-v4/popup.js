// Al cargar el popup, obtener la API Key almacenada (si existe)
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('apiKey', (data) => {
      if (data.apiKey) {
        document.getElementById('apiKey').value = data.apiKey;
      }
    });
  
    // Guardar la API Key cuando el formulario se envíe
    document.getElementById('apiKeyForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const apiKey = document.getElementById('apiKey').value;
  
      if (apiKey) {
        // Almacenar la API Key usando chrome.storage
        chrome.storage.sync.set({ apiKey: apiKey }, () => {
          alert('API Key guardada con éxito');
        });
      }
    });
  });
  