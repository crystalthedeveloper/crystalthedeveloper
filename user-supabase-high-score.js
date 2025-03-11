// supabase HighScore
document.addEventListener("DOMContentLoaded", async () => {
  // ✅ Ensure Supabase is loaded
  if (!window.supabaseClient) {
      console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
      return;
  }

  const supabase = window.supabaseClient;

  try {
      // ✅ Fetch the currently logged-in user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
          updateUI(null, "No user logged in.");
          return;
      }

      const user = session.user;

      // ✅ Fetch the highest score for the logged-in user
      const { data, error } = await supabase
          .from("player_stats")
          .select("score, kills, created_at")
          .eq("user_id", user.id)
          .order("score", { ascending: false }) // ✅ Get highest score first
          .limit(1)
          .single(); // ✅ Only fetch the top result

      if (error || !data) {
          updateUI(user.email, "No high score found.");
          return;
      }

      // ✅ Format the date
      const createdAt = new Date(data.created_at).toLocaleDateString();

      // ✅ Update the UI with values
      updateUI(user.email, data.score, data.kills, createdAt);
  } catch (err) {
      updateUI(null, "Error fetching data.");
  }

  // ✅ Function to update the UI elements
  function updateUI(email, score = "0", kills = "0", createdAt = "N/A") {
      const emailElement = document.querySelector("#email");
      const scoreElement = document.querySelector("#score");
      const killsElement = document.querySelector("#kills");
      const createdAtElement = document.querySelector("#created-at");

      if (emailElement) emailElement.textContent = email || "No Email Found";
      if (scoreElement) scoreElement.textContent = score;
      if (killsElement) killsElement.textContent = kills;
      if (createdAtElement) createdAtElement.textContent = createdAt;
  }
});