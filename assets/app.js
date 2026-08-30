const content = document.querySelector("#content");
const firstDoc = document.querySelector("[data-doc]");
const links = document.querySelectorAll("[data-doc]");
const sourceLink = document.querySelector(".source-link");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inlineFormat(value) {
  return escapeHtml(value)
    .replace(/\[\[([^\]]+)\]\]/g, "<span>$1</span>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inCode = false;
  let inList = false;
  let code = [];

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  function closeCode() {
    if (inCode) {
      html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      code = [];
      inCode = false;
    }
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        closeCode();
      } else {
        closeList();
        inCode = true;
        code = [];
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (line.trim() === "---") {
      closeList();
      html.push("<hr>");
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineFormat(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^\s*-\s+(.+)$/);
    if (bullet) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineFormat(bullet[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineFormat(line)}</p>`);
  }

  closeCode();
  closeList();
  return html.join("\n");
}

async function loadDocument(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  const markdown = await response.text();
  content.innerHTML = markdownToHtml(markdown);
}

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    links.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    sourceLink.href = link.dataset.doc;
    loadDocument(link.dataset.doc).catch((error) => {
      content.textContent = error.message;
    });
  });
});

const initialDoc = location.hash === "#chatgpt-cli-install"
  ? document.querySelector('[data-doc="docs/chatgpt-cli-install.md"]')
  : firstDoc;

if (initialDoc) {
  links.forEach((item) => item.classList.remove("active"));
  initialDoc.classList.add("active");
  sourceLink.href = initialDoc.dataset.doc;
}

loadDocument(initialDoc.dataset.doc).catch((error) => {
  content.textContent = error.message;
});
