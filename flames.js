document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) return;

  const supabase = window.supabaseClient;
  const flameCountEl = document.getElementById("flame-count");
  const flameButton = document.getElementById("flame-count-button");

  if (!flameCountEl || !flameButton) return;

  const setButtonAsVoted = () => {
    flameButton.disabled = true;
    flameButton.classList.add("voted");
    flameButton.innerText = "🔥 Purged!";
  };

  const fetchFlameCount = async () => {
    const { count, error } = await supabase
      .from("flames")
      .select("*", { count: "exact", head: true });

    if (error) return 0;
    return count || 0;
  };

  const animateFlameCount = (current, target) => {
    const step = () => {
      if (current < target) {
        flameCountEl.textContent = `${++current}`;
        requestAnimationFrame(step);
      }
    };
    step();
  };

  const addFlame = async () => {
    if (localStorage.getItem("flameClicked") === "true") return;

    flameButton.disabled = true;
    const { error } = await supabase.from("flames").insert({});
    if (error) return;

    const newCount = await fetchFlameCount();
    const currentCount = parseInt(flameCountEl.textContent) || 0;
    animateFlameCount(currentCount, newCount);

    localStorage.setItem("flameClicked", "true");
    setButtonAsVoted();
  };

  const initialCount = await fetchFlameCount();
  flameCountEl.textContent = `${initialCount}`;

  if (localStorage.getItem("flameClicked") === "true") {
    setButtonAsVoted();
  }

  flameButton.addEventListener("click", addFlame);
});