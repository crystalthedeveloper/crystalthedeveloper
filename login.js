// Login
document.addEventListener("DOMContentLoaded", () => {
    if (!window.supabaseClient) {
        console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
        return;
    }

    const supabase = window.supabaseClient;
    const loginForm = document.querySelector("#login-form");
    const formError = document.querySelector("#form-error");

    // Utility function to display error messages
    const displayError = (message) => {
        formError.textContent = message;
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

            // Step 2: Insert user into player_stats (if not exists)
            const { data: user } = await supabase.auth.getUser();
            if (!user || !user.user) throw new Error("User not found.");

            const userId = user.user.id;
            const firstName = user.user.user_metadata?.first_name || "Unknown";
            const lastName = user.user.user_metadata?.last_name || "User";

            // Check if user already exists in player_stats
            const { data: existingPlayer } = await supabase
                .from("player_stats")
                .select("id")
                .eq("user_id", userId)
                .single();

            if (!existingPlayer) {
                await supabase.from("player_stats").insert([
                    {
                        user_id: userId,
                        first_name: firstName,
                        last_name: lastName,
                        score: 0,
                        kills: 0,
                    },
                ]);
            }

            // Redirect to game
            window.location.href = "https://www.crystalthedeveloper.ca";
        } catch (err) {
            displayError(`Login failed: ${err.message}`);
        }
    });
});