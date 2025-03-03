// signup
document.addEventListener("DOMContentLoaded", () => {
    const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
    const SUPABASE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";
  
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const signupForm = document.querySelector("#signup-form");
    const errorContainer = document.querySelector("#error-messages");
  
    signupForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorContainer.textContent = ""; // Clear previous errors
  
      const email = document.querySelector("#signup-email")?.value.trim();
      const password = document.querySelector("#signup-password")?.value.trim();
      const firstName = document.querySelector("#signup-first-name")?.value.trim();
  
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName } },
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