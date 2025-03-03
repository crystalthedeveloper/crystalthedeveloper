// Login
document.addEventListener("DOMContentLoaded", () => {
    // Supabase configuration
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

    // Initialize Supabase client
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
            const { data, error } = await supabaseClient.auth.signInWithPassword({
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