// Check for user session
document.addEventListener("DOMContentLoaded", async () => {
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        // Check for session with getSession()
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError || !sessionData.session) {
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
            return;
        }

        // Allow the authenticated user access to the protected page
        if (window.location.pathname === "/user-pages/login") {
            window.location.href = "https://www.crystalthedeveloper.ca/the-developer-clown-hunt-fps";
        }
    } catch (err) {
        window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
    }

    // Listen for real-time session changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session && event === "SIGNED_IN") {
            window.location.href = "https://www.crystalthedeveloper.ca/the-developer-clown-hunt-fps";
        } else if (!session) {
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
        }
    });
});