// Check for user session
document.addEventListener("DOMContentLoaded", async () => {
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        console.log("🔄 Checking session...");

        // 🔄 Ensure Supabase has initialized the session before checking
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay check

        // ✅ First, try to refresh the session
        await supabaseClient.auth.refreshSession();

        // ✅ Now check if user exists
        const { data: userData, error: userError } = await supabaseClient.auth.getUser();

        if (userError || !userData?.user) {
            console.warn("⚠️ No user found, redirecting to login.");
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
            return;
        }

        console.log("✅ Authenticated User:", userData.user);

        // ✅ Redirect if user is on login page
        if (window.location.pathname === "/user-pages/login") {
            window.location.href = "https://www.crystalthedeveloper.ca/the-developer-clown-hunt-fps";
        }
    } catch (err) {
        console.error("❌ Error in session check:", err);
        window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
    }

    // ✅ Real-time session listener (handles logout cases)
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log("🔄 Auth state changed:", event);
        if (session && event === "SIGNED_IN") {
            window.location.href = "https://www.crystalthedeveloper.ca/the-developer-clown-hunt-fps";
        } else if (!session) {
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
        }
    });
});
