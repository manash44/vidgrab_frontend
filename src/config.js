export const APP_CONFIG = {
  name: "VidGetNow",
  subtitle: "Download video offline from anywhere",
  description: "The fast, free, and secure way to download videos.",
  // VITE_BACKEND_URL can override this for native builds.
  // Connect directly to the Render deployed backend.
  backendUrl: import.meta.env.VITE_BACKEND_URL || "https://backend-iu1e.onrender.com",
}
