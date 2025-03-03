// login & logout button 
document.addEventListener("DOMContentLoaded", async () => {
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const toggleBtn = document.querySelector("#auth-toggle-btn");

    // Ensure the button exists before adding event listeners
    if (!toggleBtn) {
        console.error("⚠️ Auth toggle button not found in the DOM.");
        return;
    }

    // ✅ Function to update button based on authentication status
    async function updateAuthButton() {
        try {
            const { data: { user }, error } = await supabaseClient.auth.getUser();

            if (error) {
                console.error("⚠️ Error fetching user:", error.message);
                return;
            }

            if (user) {
                toggleBtn.textContent = "Logout";
                toggleBtn.dataset.authAction = "logout";
            } else {
                toggleBtn.textContent = "Login";
                toggleBtn.dataset.authAction = "login";
            }
        } catch (err) {
            console.error("⚠️ Unexpected error in updateAuthButton:", err);
        }
    }

    // Initial check for authentication state
    await updateAuthButton();

    // ✅ Handle login/logout actions
    toggleBtn.addEventListener("click", async () => {
        const authAction = toggleBtn.dataset.authAction;

        if (authAction === "logout") {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) {
                    console.error("⚠️ Logout failed:", error.message);
                } else {
                    console.log("✅ Successfully logged out.");
                    window.location.href = "https://www.crystalthedeveloper.ca/";
                }
            } catch (err) {
                console.error("⚠️ Unexpected error during logout:", err);
            }
        } else if (authAction === "login") {
            console.log("🔑 Redirecting to login...");
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
        }
    });
});