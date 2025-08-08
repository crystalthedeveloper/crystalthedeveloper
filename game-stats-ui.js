//game-stats-ui.js

document.addEventListener("DOMContentLoaded", () => {
  if (!window.supabaseClient) {
    console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
    return;
  }

  const supabase = window.supabaseClient;

  function deferToIdle(fn) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fn, { timeout: 2000 });
    } else {
      setTimeout(fn, 500);
    }
  }

  deferToIdle(() => {
    fetchHighScore(supabase);
    fetchTop3Leaderboard(supabase);
  });

  // ✅ Fetch the logged-in user's high score using `logo` instead of `score`
  async function fetchHighScore(supabase) {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        updateUI(null, "No user logged in.");
        return;
      }

      const user = session.user;

      const { data, error } = await supabase
        .from("player_stats")
        .select("logo, kills, created_at")
        .eq("user_id", user.id)
        .order("logo", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        updateUI(user.email, "No high score found.");
        return;
      }

      const createdAt = new Date(data.created_at).toLocaleDateString();
      updateUI(user.email, data.logo, data.kills, createdAt);
    } catch (err) {
      updateUI(null, "Error fetching data.");
    }
  }

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

  // ✅ Fetch and update top 3 leaderboard
  async function fetchTop3Leaderboard(supabase) {
    try {
      const { data, error } = await supabase
        .from("player_stats")
        .select("first_name, last_name, logo, kills, play_time")
        .order("logo", { ascending: false })
        .limit(20);

      if (error || !data?.length) {
        console.error("❌ No leaderboard data found.");
        updateLeaderboard(null);
        return;
      }

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
  }

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
      if (scoreEl) scoreEl.textContent = player.logo ?? "0";
      if (killsEl) killsEl.textContent = player.kills ?? "0";
      if (timerEl) timerEl.textContent = sanitizeTime(player.play_time);
    });
  }
});