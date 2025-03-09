// Check for user session
document.addEventListener("DOMContentLoaded", async () => {
    // Ensure Supabase is loaded
    if (!window.supabaseClient) {
        console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
        return;
    }

    const supabase = window.supabaseClient;

    // Check if the current page is the protected user account page
    if (window.location.pathname === "/user-pages/user-account") {
        try {
            // Get session data
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            // Redirect to login if no session found
            if (sessionError || !sessionData?.session) {
                window.location.replace("https://www.crystalthedeveloper.ca/user-pages/login");
            }
        } catch (err) {
            console.error("❌ Error checking session:", err);
            window.location.replace("https://www.crystalthedeveloper.ca/user-pages/login");
        }
    }
});