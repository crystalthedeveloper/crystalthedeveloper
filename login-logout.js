document.addEventListener("DOMContentLoaded", async () => {
    // Supabase credentials
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    // Ensure Supabase is available
    if (!window.supabase) {
        console.error("❌ Supabase library not loaded.");
        return;
    }

    // Initialize Supabase client
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // ✅ Wait for element utility function
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkExist = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkExist);
                    resolve(element);
                }
                if (Date.now() - startTime > timeout) {
                    clearInterval(checkExist);
                    reject(new Error(`⚠️ Element ${selector} not found after ${timeout}ms.`));
                }
            }, 100);
        });
    }

    try {
        // ✅ Ensure the button exists before proceeding
        const toggleBtn = await waitForElement("#auth-toggle-btn");

        // ✅ Function to update authentication button state
        async function updateAuthButton() {
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

        // ✅ Update button state on page load
        await updateAuthButton();

        // ✅ Add event listener for login/logout actions
        toggleBtn.addEventListener("click", async () => {
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
    } catch (error) {
        console.warn(error.message);
    }
});