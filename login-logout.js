// login & logout button 
document.addEventListener("DOMContentLoaded", async () => {
    // Supabase credentials
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    if (!window.supabase) {
        console.error("❌ Supabase library is not loaded.");
        return;
    }

    // ✅ Initialize Supabase client
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // ✅ Check if the page has the login/logout button
    const toggleBtn = document.querySelector("#auth-toggle-btn");

    if (toggleBtn) {
        console.log("🔄 Found #auth-toggle-btn, setting up authentication handling...");

        // ✅ Function to update button based on authentication status
        async function updateAuthButton() {
            try {
                const { data: sessionData } = await supabaseClient.auth.getSession();
                if (!sessionData.session) {
                    console.warn("⚠️ No active session found.");
                    toggleBtn.textContent = "Login";
                    toggleBtn.dataset.authAction = "login";
                    return;
                }

                const { data: userData } = await supabaseClient.auth.getUser();
                if (!userData?.user) {
                    console.warn("⚠️ Auth session missing! No user found.");
                    toggleBtn.textContent = "Login";
                    toggleBtn.dataset.authAction = "login";
                    return;
                }

                console.log("✅ User logged in:", userData.user);
                toggleBtn.textContent = "Logout";
                toggleBtn.dataset.authAction = "logout";
            } catch (err) {
                console.error("⚠️ Unexpected error in updateAuthButton:", err);
            }
        }

        // ✅ Initial authentication check
        await updateAuthButton();

        // ✅ Handle login/logout button click
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

        // ✅ Listen for real-time session changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session && event === "SIGNED_IN") {
                console.log("✅ Session found, redirecting...");
                window.location.href = "https://www.crystalthedeveloper.ca/the-developer-clown-hunt-fps";
            } else if (!session) {
                console.warn("⚠️ No active session, redirecting to login.");
                window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
            }
        });

    } else {
        console.warn("⚠️ #auth-toggle-btn not found on this page. Skipping login/logout button setup.");
    }

    // ✅ Handle authentication check for the game page
    if (window.location.pathname === "/the-developer-clown-hunt-fps") {
        console.log("🎮 Checking authentication for game page...");
        const { data: sessionData } = await supabaseClient.auth.getSession();
        if (!sessionData.session) {
            console.warn("⚠️ User not logged in, redirecting to login page.");
            window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
        }
    }
});