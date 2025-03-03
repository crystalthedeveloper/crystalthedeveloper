// Fetch the authenticated user name
document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://pkaeqqqxhkgosfppzmmt.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWVxcXF4aGtnb3NmcHB6bW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzEyMjgsImV4cCI6MjA0OTg0NzIyOH0.dpxd-Y6Zvfu_1tcfELPNV7acq6X9tWMd8paNK28ncsc";

  // Properly initialize Supabase client
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // Fetch the currently logged-in user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      updateUserInfo("Welcome");
      return;
    }

    const user = session.user;

    // Retrieve the first_name from user metadata
    const firstName = user.user_metadata?.first_name || "User";
    updateUserInfo(`Welcome, ${firstName}!`);
  } catch (err) {
    updateUserInfo("Welcome");
  }

  // Function to update the #user-info element
  function updateUserInfo(message) {
    const userElement = document.querySelector("#user-info");
    if (userElement) {
      userElement.textContent = message;
    }
  }
});