//supabase-top3-leaderboard

document.addEventListener("DOMContentLoaded", async () => {
    // ✅ Ensure Supabase is loaded
    if (!window.supabaseClient) {
        console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
        return;
    }

    const supabase = window.supabaseClient;

    try {
        // ✅ Fetch the top 3 highest scores
        const { data, error } = await supabase
            .from("player_stats")
            .select("first_name, last_name, score, kills")
            .order("score", { ascending: false }) // ✅ Highest score first
            .limit(3); // ✅ Only fetch top 3

        if (error || !data.length) {
            console.error("❌ No high scores found.");
            updateLeaderboard(null);
            return;
        }

        // ✅ Update leaderboard UI
        updateLeaderboard(data);
    } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        updateLeaderboard(null);
    }

    // ✅ Function to update the top 3 leaderboard UI
    function updateLeaderboard(scores) {
        const name1 = document.querySelector("#name-1");
        const score1 = document.querySelector("#score-1");
        const kills1 = document.querySelector("#kills-1");

        const name2 = document.querySelector("#name-2");
        const score2 = document.querySelector("#score-2");
        const kills2 = document.querySelector("#kills-2");

        const name3 = document.querySelector("#name-3");
        const score3 = document.querySelector("#score-3");
        const kills3 = document.querySelector("#kills-3");

        // ✅ Clear UI if no data
        if (!scores || scores.length === 0) {
            if (name1) name1.textContent = "No Data";
            if (score1) score1.textContent = "0";
            if (kills1) kills1.textContent = "0";

            if (name2) name2.textContent = "No Data";
            if (score2) score2.textContent = "0";
            if (kills2) kills2.textContent = "0";

            if (name3) name3.textContent = "No Data";
            if (score3) score3.textContent = "0";
            if (kills3) kills3.textContent = "0";

            return;
        }

        // ✅ Update first place
        if (scores[0]) {
            if (name1) name1.textContent = `${scores[0].first_name} ${scores[0].last_name}`;
            if (score1) score1.textContent = scores[0].score;
            if (kills1) kills1.textContent = scores[0].kills;
        }

        // ✅ Update second place
        if (scores[1]) {
            if (name2) name2.textContent = `${scores[1].first_name} ${scores[1].last_name}`;
            if (score2) score2.textContent = scores[1].score;
            if (kills2) kills2.textContent = scores[1].kills;
        } else {
            if (name2) name2.textContent = "No Data";
            if (score2) score2.textContent = "0";
            if (kills2) kills2.textContent = "0";
        }

        // ✅ Update third place
        if (scores[2]) {
            if (name3) name3.textContent = `${scores[2].first_name} ${scores[2].last_name}`;
            if (score3) score3.textContent = scores[2].score;
            if (kills3) kills3.textContent = scores[2].kills;
        } else {
            if (name3) name3.textContent = "No Data";
            if (score3) score3.textContent = "0";
            if (kills3) kills3.textContent = "0";
        }
    }
});