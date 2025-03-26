//supabase-top3-leaderboard

document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) {
      console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
      return;
    }
  
    const supabase = window.supabaseClient;
  
    try {
      const { data, error } = await supabase
        .from("player_stats")
        .select("first_name, last_name, score, kills, play_time")
        .order("score", { ascending: false })
        .limit(20);
  
      if (error || !data?.length) {
        console.error("❌ No high scores found.");
        updateLeaderboard(null);
        return;
      }
  
      // ✅ Filter to only top 3 unique users
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
  
    // ✅ Fallback if play_time is missing or blank
    function sanitizeTime(playTime) {
      if (!playTime || typeof playTime !== "string" || !playTime.includes(":")) {
        return "00:00";
      }
      return playTime;
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
        if (timerEl) timerEl.textContent = sanitizeTime(player.play_time);
      });
    }
  });  