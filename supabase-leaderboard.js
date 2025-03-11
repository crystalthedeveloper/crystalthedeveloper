//supabase-leaderboard

document.addEventListener("DOMContentLoaded", async () => {
    // ✅ Ensure Supabase is loaded
    if (!window.supabaseClient) {
        console.error("❌ Supabase Client not found! Ensure `supabaseClient.js` is loaded first.");
        return;
    }

    const supabase = window.supabaseClient;

    try {
        // ✅ Fetch the top 10 highest scores
        const { data, error } = await supabase
            .from("player_stats")
            .select("first_name, last_name, score, kills, created_at")
            .order("score", { ascending: false }) // ✅ Highest score first
            .limit(10); // ✅ Limit to top 10 players

        if (error || !data.length) {
            updateLeaderboard("No high scores found.");
            return;
        }

        // ✅ Populate the leaderboard table
        updateLeaderboard(data);
    } catch (err) {
        updateLeaderboard("Error fetching leaderboard.");
    }

    // ✅ Function to update the leaderboard table
    function updateLeaderboard(scores) {
        const tableBody = document.querySelector("#leaderboard-body");

        if (!tableBody) {
            console.error("❌ Leaderboard table body not found!");
            return;
        }

        tableBody.innerHTML = ""; // ✅ Clear previous content

        if (typeof scores === "string") {
            tableBody.innerHTML = `<tr><td colspan="4">${scores}</td></tr>`;
            return;
        }

        scores.forEach((player, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.first_name} ${player.last_name}</td>
                <td>${player.score}</td>
                <td>${player.kills}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});