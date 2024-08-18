document.addEventListener("mouseup", async function (event) {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    const selectedText = selection.toString().trim();
    const rect = selection.getRangeAt(0).getBoundingClientRect();

    const existingBox = document.getElementById("translate-box");
    if (existingBox) {
      existingBox.remove();
    }

    const translateBox = document.createElement("div");
    translateBox.id = "translate-box";
    translateBox.innerText = "Translate";
    translateBox.style.position = "absolute";
    translateBox.style.top = `${rect.bottom + window.scrollY}px`;
    translateBox.style.left = `${rect.left + window.scrollX}px`;
    translateBox.style.padding = "5px";
    translateBox.style.backgroundColor = "#000";
    translateBox.style.color = "#fff";
    translateBox.style.cursor = "pointer";
    translateBox.style.zIndex = "1000";

    translateBox.addEventListener("click", async function () {
      const meaning = await getTranslation(selectedText);
      translateBox.innerText = meaning;
    });

    document.body.appendChild(translateBox);
  }
});

async function getTranslation(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return (
      data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found"
    );
  } catch (error) {
    console.error("Error fetching definition:", error);
    return "Error fetching definition";
  }
}

document.addEventListener("click", function (event) {
  const translateBox = document.getElementById("translate-box");
  if (translateBox && !translateBox.contains(event.target)) {
    translateBox.remove();
  }
});
