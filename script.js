fetch("articles.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load articles.json");
    }
    return response.json();
  })
  .then(data => {
    const container = document.getElementById("article-list");
    container.innerHTML = "";

    const articles = data.articles || [];

    if (articles.length === 0) {
      container.innerHTML = "<p>No articles indexed yet.</p>";
      return;
    }

    articles.forEach(article => {
      const div = document.createElement("div");
      div.className = "article";

      // Authors (support simple string OR structured objects)
      let authorsText = "";
      if (Array.isArray(article.authors)) {
        authorsText = article.authors.map(a => {
          if (typeof a === "string") return a;
          return a.name || `${a.first_name || ""} ${a.last_name || ""}`.trim();
        }).join(", ");
      }

      const journalMeta = `
        ${data.journal.name}<br>
        Volume ${article.volume} · Issue ${article.issue} · ${article.year}
      `;

      const extraMeta = `
        ${article.doi ? `DOI: ${article.doi}<br>` : ""}
        ${article.page_range ? `Pages: ${article.page_range}` : ""}
      `;

      const viewUrl = article.url ? article.url : "#";
      const pdfUrl = article.pdf ? article.pdf : "#";

      div.innerHTML = `
        <h2>${article.title}</h2>
        <div class="authors">${authorsText}</div>
        <div class="journal-meta">${journalMeta}</div>
        <div class="extra-meta">${extraMeta}</div>
        <div class="actions">
          ${article.url ? `<a href="${viewUrl}">View Article</a>` : ""}
          ${article.pdf ? `<a href="${pdfUrl}" target="_blank">Download PDF</a>` : ""}
        </div>
      `;

      container.appendChild(div);
    });
  })
  .catch(error => {
    console.error(error);
    document.getElementById("article-list").innerHTML =
      "<p>Error loading article index.</p>";
  });
