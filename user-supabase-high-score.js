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
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError || !session) {
        updateHighScoreInfo("No user logged in.");
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
        updateHighScoreInfo("No high score found.");
        return;
      }
  
      // ✅ Format the date
      const createdAt = new Date(data.created_at).toLocaleDateString();
  
      // ✅ Update the UI
      updateHighScoreInfo(`High Score: ${data.score} | Kills: ${data.kills} | Date: ${createdAt}`);
    } catch (err) {
      updateHighScoreInfo("Error fetching high score.");
    }
  
    // ✅ Function to update the UI element
    function updateHighScoreInfo(message) {
      const highScoreElement = document.querySelector("#high-score-info");
      if (highScoreElement) {
        highScoreElement.textContent = message;
      }
    }
  });  