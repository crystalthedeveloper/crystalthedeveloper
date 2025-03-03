// Login
document.addEventListener("DOMContentLoaded", async () => {
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    if (!window.supabase) {
        console.error("❌ Supabase library is not loaded.");
        return;
    }

    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const loginForm = document.querySelector("#login-form");
    const formError = document.querySelector("#form-error");
    const toggleBtn = document.querySelector("#auth-toggle-btn");

    // ✅ Utility function to check session before getting user
    async function getUserSession() {
        try {
            const { data: sessionData, error } = await supabaseClient.auth.getSession();
            if (error || !sessionData?.session) {
                console.warn("⚠️ No active session found.");
                return null;
            }

            const { data: userData, error: userError } = await supabaseClient.auth.getUser();
            if (userError || !userData?.user) {
                console.warn("⚠️ Auth session missing! No user found.");
                return null;
            }

            console.log("✅ User logged in:", userData.user);
            return userData.user;
        } catch (err) {
            console.error("⚠️ Error checking session:", err);
            return null;
        }
    }

    // ✅ Function to update button based on authentication status
    async function updateAuthButton() {
        if (!toggleBtn) {
            console.warn("⚠️ auth-toggle-btn not found. Skipping update.");
            return;
        }

        const user = await getUserSession();

        if (user) {
            toggleBtn.textContent = "Logout";
            toggleBtn.dataset.authAction = "logout";
        } else {
            toggleBtn.textContent = "Login";
            toggleBtn.dataset.authAction = "login";
        }
    }

    // ✅ Check authentication state on page load
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
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

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
