// Login
document.addEventListener("DOMContentLoaded", async () => {
    // Supabase configuration
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    if (!window.supabase) {
        console.error("❌ Supabase library is not loaded.");
        return;
    }

    // Initialize Supabase client
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Form & button elements
    const loginForm = document.querySelector("#login-form");
    const formError = document.querySelector("#form-error");
    const toggleBtn = document.querySelector("#auth-toggle-btn");

    // ✅ Utility function to update button state
    async function updateAuthButton() {
        if (!toggleBtn) {
            console.warn("⚠️ auth-toggle-btn not found. Skipping auth button update.");
            return;
        }

        try {
            const { data, error } = await supabaseClient.auth.getUser();
            if (error) {
                console.error("⚠️ Error fetching user:", error.message);
                return;
            }

            if (data?.user) {
                console.log("✅ User logged in:", data.user);
                toggleBtn.textContent = "Logout";
                toggleBtn.dataset.authAction = "logout";
            } else {
                console.log("⚠️ No active session found.");
                toggleBtn.textContent = "Login";
                toggleBtn.dataset.authAction = "login";
            }
        } catch (err) {
            console.error("⚠️ Unexpected error in updateAuthButton:", err);
        }
    }

    // ✅ Run on page load to check authentication state
    await updateAuthButton();

    // ✅ Login form submission
    loginForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.querySelector("#login-email")?.value.trim();
        const password = document.querySelector("#login-password")?.value.trim();

        formError.textContent = ""; // Clear previous errors

        if (!email || !password) {
            formError.textContent = "Please enter both email and password.";
            return;
        }

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            console.log("✅ Login successful:", data);
            window.location.href = "https://www.crystalthedeveloper.ca/the-developer-clown-hunt-fps";
        } catch (err) {
            formError.textContent = `Login failed: ${err.message}`;
        }
    });

    // ✅ Handle login/logout button click
    toggleBtn?.addEventListener("click", async () => {
        const authAction = toggleBtn.dataset.authAction;

        if (authAction === "logout") {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (!error) {
                    console.log("✅ Successfully logged out.");
                    window.location.href = "https://www.crystalthedeveloper.ca/";
                }
            } catch (err) {
                console.error("⚠️ Unexpected error during logout:", err);
            }
        } else if (authAction === "login") {
            console.log("🔑 Redirecting to login page...");
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
        }
    });
});