// Check for user session
document.addEventListener("DOMContentLoaded", async () => {
    // ✅ Ensure Supabase is loaded
    if (!window.supabaseClient) {
        console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
        return;
    }

    const supabase = window.supabaseClient;

    try {
        // ✅ Check user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const isLoggedIn = sessionData?.session !== null;

        // ✅ Redirect if the user is on a protected page and not logged in
        const protectedPages = ["/user-pages/user-account", "/user-pages/user-accounts"];
        if (protectedPages.includes(window.location.pathname) && !isLoggedIn) {
            window.location.replace("https://www.crystalthedeveloper.ca/user-pages/login");
            return;
        }

        // ✅ Hide or Show sections based on login status
        toggleProtectedSections(isLoggedIn);
    } catch (err) {
        console.error("❌ Error checking session:", err);
        window.location.replace("https://www.crystalthedeveloper.ca/user-pages/login");
    }

    // ✅ Function to show/hide protected sections
    function toggleProtectedSections(isLoggedIn) {
        const protectedSections = ["leaderboard", "hoodie"];

        protectedSections.forEach((id) => {
            const section = document.querySelector(`#${id}`);
            if (section) {
                section.style.display = isLoggedIn ? "block" : "none";
            }
        });
    }
});