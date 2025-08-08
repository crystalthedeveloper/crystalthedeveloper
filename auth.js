document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  const toggleBtn = document.querySelector("#auth-toggle-btn");
  const userInfoEl = document.querySelector("#user-info");

  if (!supabase) {
    console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
    return;
  }

  // ✅ Protected Page Redirect
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const isLoggedIn = sessionData?.session !== null;

    const protectedPages = ["/user-pages/user-account", "/user-pages/user-accounts"];
    if (protectedPages.includes(window.location.pathname) && !isLoggedIn) {
      window.location.replace("https://www.crystalthedeveloper.ca/user-pages/login");
      return;
    }

    toggleProtectedSections(isLoggedIn);
  } catch (err) {
    console.error("❌ Error checking session:", err);
    window.location.replace("https://www.crystalthedeveloper.ca/user-pages/login");
    return;
  }

  // ✅ Update login/logout button
  async function updateAuthButton() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!toggleBtn) return;

    if (error || !session || !session.user) {
      toggleBtn.textContent = "Login";
      toggleBtn.dataset.authAction = "login";
    } else {
      toggleBtn.textContent = "Logout";
      toggleBtn.dataset.authAction = "logout";
    }
  }

  await updateAuthButton();

  // ✅ Auth toggle handler
  toggleBtn?.addEventListener("click", async () => {
    const authAction = toggleBtn.dataset.authAction;

    if (authAction === "logout") {
      await supabase.auth.signOut();
      window.location.href = "https://www.crystalthedeveloper.ca/";
    } else {
      window.location.href = "https://www.crystalthedeveloper.ca/user-pages/login";
    }
  });

  // ✅ Display user greeting
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    const firstName = user?.user_metadata?.first_name || "User";
    if (userInfoEl) userInfoEl.textContent = session && user ? `Welcome, ${firstName}!` : "Welcome";
  } catch {
    if (userInfoEl) userInfoEl.textContent = "Welcome";
  }

  // ✅ Show/hide sections like leaderboard or hoodie
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