// login & logout button 
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase Client
const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Wait for the DOM to Load
document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM fully loaded. Checking authentication status...");

    const toggleBtn = document.querySelector("#auth-toggle-btn");
    if (!toggleBtn) {
        console.warn("⚠️ Login/logout button not found. Skipping auth check.");
        return;
    }

    await updateAuthButton();

    // ✅ Handle Login/Logout
    toggleBtn.addEventListener("click", async () => {
        const authAction = toggleBtn.dataset.authAction;

        if (authAction === "logout") {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (!error) {
                    console.log("✅ Successfully logged out.");
                    window.location.href = "https://www.crystalthedeveloper.ca/";
                } else {
                    console.error("❌ Logout error:", error.message);
                }
            } catch (error) {
                console.error("❌ Unexpected logout error:", error);
            }
        } else if (authAction === "login") {
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
        }
    });
});

// ✅ Function to Update Auth Button
async function updateAuthButton() {
    const toggleBtn = document.querySelector("#auth-toggle-btn");

    if (!toggleBtn) {
        console.warn("⚠️ Login/logout button not found.");
        return;
    }

    try {
        // ✅ Use getSession() Instead of refreshSession()
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError || !sessionData.session) {
            console.warn("⚠️ No active session found.");
        }

        // ✅ Now check for user
        const { data: user, error: userError } = await supabaseClient.auth.getUser();

        if (userError) {
            console.error("⚠️ Error fetching user:", userError.message);
            return;
        }

        if (user && user.user) {
            toggleBtn.textContent = "Logout";
            toggleBtn.dataset.authAction = "logout";
        } else {
            toggleBtn.textContent = "Login";
            toggleBtn.dataset.authAction = "login";
        }

        console.log("✅ Auth button updated:", toggleBtn.textContent);
    } catch (err) {
        console.error("❌ Unexpected error in updateAuthButton:", err);
    }
}