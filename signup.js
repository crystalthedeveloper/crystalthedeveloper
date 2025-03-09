// signup
document.addEventListener("DOMContentLoaded", () => {
  if (!window.supabaseClient) {
    console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
    return;
  }

  const supabase = window.supabaseClient;
  const signupForm = document.querySelector("#signup-form");
  const errorContainer = document.querySelector("#error-messages");

  signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorContainer.textContent = ""; 

    const email = document.querySelector("#signup-email")?.value.trim();
    const password = document.querySelector("#signup-password")?.value.trim();
    const firstName = document.querySelector("#signup-first-name")?.value.trim();
    const lastName = document.querySelector("#signup-last-name")?.value.trim();

    if (!email || !password || !firstName || !lastName) {
      errorContainer.textContent = "All fields are required.";
      errorContainer.style.color = "red";
      return;
    }

    try {
      // Step 1: Sign up user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      });

      if (error) throw error;

      errorContainer.textContent = "Signup successful! Verify your email.";
      errorContainer.style.color = "green";

      setTimeout(() => {
        window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
      }, 2000);
    } catch (err) {
      errorContainer.textContent = `Signup failed: ${err.message}`;
      errorContainer.style.color = "red";
    }
  });
});