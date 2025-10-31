// ================== UTILITY FUNCTIONS ==================
function toast(msg, color = "#222") {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:25px;right:25px;background:${color};
    color:white;padding:10px 18px;border-radius:10px;
    font-size:15px;z-index:9999;opacity:0;transition:opacity 0.3s;
  `;
  document.body.appendChild(t);
  setTimeout(() => (t.style.opacity = 1), 100);
  setTimeout(() => (t.style.opacity = 0), 2700);
  setTimeout(() => t.remove(), 3000);
}

async function fetchSnippetById(id) {
  try {
    const res = await fetch(`/api/snippets/${id}`);
    if (!res.ok) throw new Error("Snippet not found");
    return await res.json();
  } catch (err) {
    toast("❌ Failed to fetch snippet", "#c33");
    return null;
  }
}

// ================== INDEX.HTML LOGIC ==================
async function loadSnippets() {
  const list = document.getElementById("snippet-list");
  if (!list) return; // Not on index.html

  try {
    const res = await fetch("/api/snippets");
    if (!res.ok) throw new Error("Failed to fetch snippets");
    const snippets = await res.json();

    list.innerHTML = "";
    if (snippets.length === 0) {
      list.innerHTML = `<p style="text-align:center;color:#999;">No snippets found 😢</p>`;
      return;
    }

    snippets.forEach(s => {
      const div = document.createElement("div");
      div.className = "snippet fade-in";
      div.innerHTML = `
        <h3>${s.title}</h3>
        <p><b>${s.language || "Unknown"}</b> | ${s.tags || "No tags"}</p>
        <pre><code class="language-${(s.language || "text").toLowerCase()}">${s.content}</code></pre>
        <div class="actions">
          <button onclick="deleteSnippet(${s.id})">🗑️ Delete</button>
          <button onclick="window.location.href='/view.html?id=${s.id}'">👁 View</button>
          <button onclick="window.location.href='/edit.html?id=${s.id}'">✏️ Edit</button>
        </div>
      `;
      list.appendChild(div);
    });

    Prism.highlightAll();
  } catch (err) {
    toast("⚠️ Could not load snippets", "#c33");
  }
}

async function deleteSnippet(id) {
  if (!confirm("Are you sure you want to delete this snippet?")) return;
  try {
    const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete snippet");
    toast("🗑️ Snippet deleted", "#444");
    loadSnippets();
  } catch (err) {
    toast("❌ Delete failed", "#c33");
  }
}

// ================== LIVE SEARCH ==================
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim().toLowerCase();
    try {
      const res = await fetch("/api/snippets");
      if (!res.ok) throw new Error("Server error");
      const snippets = await res.json();
      const filtered = snippets.filter(s =>
        (s.title && s.title.toLowerCase().includes(query)) ||
        (s.language && s.language.toLowerCase().includes(query)) ||
        (s.tags && s.tags.toLowerCase().includes(query)) ||
        (s.content && s.content.toLowerCase().includes(query))
      );
      displayFilteredSnippets(filtered);
    } catch (err) {
      toast("❌ Failed to search snippets", "#c33");
    }
  });
}

function displayFilteredSnippets(snippets) {
  const list = document.getElementById("snippet-list");
  if (!list) return;

  list.innerHTML = "";
  if (snippets.length === 0) {
    list.innerHTML = `<p style="text-align:center;color:#999;">No snippets found 😢</p>`;
    return;
  }

  snippets.forEach(s => {
    const div = document.createElement("div");
    div.className = "snippet fade-in";
    div.innerHTML = `
      <h3>${s.title}</h3>
      <p><b>${s.language || "Unknown"}</b> | ${s.tags || "No tags"}</p>
      <pre><code class="language-${(s.language || "text").toLowerCase()}">${s.content}</code></pre>
      <div class="actions">
        <button onclick="deleteSnippet(${s.id})">🗑️ Delete</button>
        <button onclick="window.location.href='/view.html?id=${s.id}'">👁 View</button>
        <button onclick="window.location.href='/edit.html?id=${s.id}'">✏️ Edit</button>
      </div>
    `;
    list.appendChild(div);
  });

  Prism.highlightAll();
}

// ================== ADD.HTML LOGIC ==================
const saveBtn = document.getElementById("save-btn");
if (saveBtn) {
  saveBtn.addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const language = document.getElementById("language").value.trim();
    const tags = document.getElementById("tags").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !language || !content) {
      toast("⚠️ Please fill all required fields", "#d9534f");
      return;
    }

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, language, tags, content })
      });
      if (!res.ok) throw new Error("Server error");

      toast("✅ Snippet saved successfully", "#238636");
      window.location.href = "/index.html";
    } catch (err) {
      toast("❌ Failed to save snippet", "#c33");
    }
  });
}

// ================== EDIT.HTML LOGIC ==================
if (window.location.pathname.includes("edit.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    fetchSnippetById(id).then(snippet => {
      if (!snippet) return;
      document.getElementById("title").value = snippet.title;
      document.getElementById("language").value = snippet.language;
      document.getElementById("tags").value = snippet.tags;
      document.getElementById("content").value = snippet.content;
    });
  }

  const saveBtnEdit = document.getElementById("save-btn");
  if (saveBtnEdit) {
    saveBtnEdit.addEventListener("click", async () => {
      const title = document.getElementById("title").value.trim();
      const language = document.getElementById("language").value.trim();
      const tags = document.getElementById("tags").value.trim();
      const content = document.getElementById("content").value.trim();

      if (!title || !language || !content) {
        toast("⚠️ Please fill all required fields", "#d9534f");
        return;
      }

      try {
        const res = await fetch(`/api/snippets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, language, tags, content })
        });
        if (!res.ok) throw new Error("Failed to update snippet");

        toast("✅ Snippet updated", "#238636");
        window.location.href = "/index.html";
      } catch (err) {
        toast("❌ Update failed", "#c33");
      }
    });
  }
}

// ================== VIEW.HTML LOGIC ==================
if (window.location.pathname.includes("view.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    fetchSnippetById(id).then(snippet => {
      if (!snippet) return;
      document.getElementById("view-title").textContent = snippet.title;
      document.getElementById("view-language").textContent = snippet.language;
      document.getElementById("view-tags").textContent = snippet.tags || "No tags";
      const codeEl = document.getElementById("view-content");
      codeEl.textContent = snippet.content;
      codeEl.className = `language-${(snippet.language || "text").toLowerCase()}`;
      Prism.highlightAll();
    });
  }
}

// ================== INIT ==================
if (document.getElementById("snippet-list")) {
  loadSnippets();
}