import axios from "axios";

// Vérifie que la variable d'environnement est bien définie
if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_API_BASE_URL n'est pas défini dans .env.local !");
}

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // défini dans .env.local
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔍 Intercepteur des requêtes (ajoute le token)
clientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📤 Requête envoyée:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
    } else {
      console.log("📤 Requête envoyée sans token:", {
        url: config.url,
        method: config.method,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error("❌ Erreur requête Axios:", error);
    return Promise.reject(error);
  }
);

// 🔍 Intercepteur des réponses
clientApi.interceptors.response.use(
  (response) => {
    console.log("✅ Réponse reçue:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ Erreur réponse backend:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });

      if (error.response.status === 401) {
        console.warn("⛔ Session expirée ou non autorisée");
        // Ici, on peut éventuellement forcer une redirection vers /login
      }
    } else {
      console.error("❌ Erreur réseau ou serveur injoignable:", error.message);
    }
    return Promise.reject(error);
  }
);

export default clientApi;
