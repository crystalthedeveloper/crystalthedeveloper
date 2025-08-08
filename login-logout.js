// login & logout button 
document.addEventListener("DOMContentLoaded", async () => {
  // Wait for Supabase to load
  if (!window.supabaseClient) {
    console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
    return;
  }

  const supabase = window.supabaseClient;
  const toggleBtn = document.querySelector("#auth-toggle-btn");

  // ✅ Update button based on user authentication status
  async function updateAuthButton() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session || !session.user) {
      toggleBtn.textContent = "Login";
      toggleBtn.dataset.authAction = "login";
    } else {
      toggleBtn.textContent = "Logout";
      toggleBtn.dataset.authAction = "logout";
    }
  }

  await updateAuthButton();

  // ✅ Handle button click for login/logout
  toggleBtn?.addEventListener("click", async () => {
    const authAction = toggleBtn.dataset.authAction;

    if (authAction === "logout") {
      try {
        const { error } = await supabase.auth.signOut();
        if (!error) {
          window.location.href = "https://www.crystalthedeveloper.ca/";
        }
      } catch (error) {
        // Optional: handle silent errors if needed
      }
    } else if (authAction === "login") {
      window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
    }
  });
});