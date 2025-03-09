// Login
document.addEventListener("DOMContentLoaded", () => {
    // Wait for Supabase to load
    if (!window.supabaseClient) {
        console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
        return;
    }

    const supabase = window.supabaseClient;

    const loginForm = document.querySelector("#login-form");
    const formError = document.querySelector("#form-error");

    // Utility function to display error messages
    const displayError = (message) => {
        formError.textContent = message; // Update error container
    };

    // Handle login form submission
    loginForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.querySelector("#login-email")?.value.trim();
        const password = document.querySelector("#login-password")?.value.trim();

        formError.textContent = ""; // Clear previous errors

        if (!email || !password) {
            displayError("Please enter both email and password.");
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            displayError(""); // Clear errors if successful
            window.location.href = "https://www.crystalthedeveloper.ca/the-developer-clown-hunt-fps";
        } catch (err) {
            displayError(`Login failed: ${err.message}`); // Display error message
        }
    });
});