const modal = document.getElementById("add-modal");
document.getElementById("add-btn").onclick = () => (modal.style.display = "flex");
document.getElementById("close-btn").onclick = () => (modal.style.display = "none");

const loadSnippets = async () => {
  const res = await fetch("/api/snippets");
  const snippets = await res.json();
  const list = document.getElementById("snippet-list");
  list.innerHTML = "";

  snippets.forEach(s => {
    const div = document.createElement("div");
    div.className = "snippet";
    div.innerHTML = `
      <h3>${s.title}</h3>
      <p><b>${s.language}</b> | ${s.tags}</p>
      <pre><code class="language-${s.language.toLowerCase()}">${s.content}</code></pre>
      <button onclick="deleteSnippet(${s.id})">🗑️ Delete</button>
    `;
    list.appendChild(div);
    Prism.highlightAll();
  });
};

const saveSnippet = async () => {
  const title = document.getElementById("title").value;
  const language = document.getElementById("language").value;
  const tags = document.getElementById("tags").value;
  const content = document.getElementById("content").value;

  await fetch("/api/snippets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, language, tags, content })
  });
  modal.style.display = "none";
  loadSnippets();
};

const deleteSnippet = async (id) => {
  await fetch(`/api/snippets/${id}`, { method: "DELETE" });
  loadSnippets();
};

document.getElementById("save-btn").onclick = saveSnippet;

loadSnippets();