//supabase-top3-leaderboard

document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) {
      console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
      return;
    }
  
    const supabase = window.supabaseClient;
  
    try {
      // ✅ Fetch more than 3 to account for duplicates
      const { data, error } = await supabase
        .from("player_stats")
        .select("first_name, last_name, score, kills, play_time")
        .order("score", { ascending: false })
        .limit(20); // Increase to ensure we get at least 3 unique players
  
      if (error || !data?.length) {
        console.error("❌ No high scores found.");
        updateLeaderboard(null);
        return;
      }
  
      // ✅ Filter to only top 3 unique users (by first + last name)
      const uniqueUsersMap = new Map();
      const uniqueScores = [];
  
      for (const entry of data) {
        const key = `${entry.first_name} ${entry.last_name}`;
        if (!uniqueUsersMap.has(key)) {
          uniqueUsersMap.set(key, true);
          uniqueScores.push(entry);
        }
        if (uniqueScores.length === 3) break;
      }
  
      updateLeaderboard(uniqueScores);
    } catch (err) {
      console.error("❌ Error fetching leaderboard:", err);
      updateLeaderboard(null);
    }
  
    function formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return "00:00";
      const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
      const ss = String(seconds % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    }
  
    function updateLeaderboard(scores) {
      const players = [
        { name: "#name-1", score: "#score-1", kills: "#kills-1", timer: "#timer-1" },
        { name: "#name-2", score: "#score-2", kills: "#kills-2", timer: "#timer-2" },
        { name: "#name-3", score: "#score-3", kills: "#kills-3", timer: "#timer-3" },
      ];
  
      players.forEach((ref, index) => {
        const player = scores?.[index];
  
        const nameEl = document.querySelector(ref.name);
        const scoreEl = document.querySelector(ref.score);
        const killsEl = document.querySelector(ref.kills);
        const timerEl = document.querySelector(ref.timer);
  
        if (!player) {
          if (nameEl) nameEl.textContent = "No Data";
          if (scoreEl) scoreEl.textContent = "0";
          if (killsEl) killsEl.textContent = "0";
          if (timerEl) timerEl.textContent = "00:00";
          return;
        }
  
        if (nameEl) nameEl.textContent = `${player.first_name} ${player.last_name}`;
        if (scoreEl) scoreEl.textContent = player.score;
        if (killsEl) killsEl.textContent = player.kills;
        if (timerEl) timerEl.textContent = formatTime(player.play_time);
      });
    }
  });  