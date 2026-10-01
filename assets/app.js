const content = document.querySelector("#content");
const metadata = document.querySelector("#metadata");
const links = Array.from(document.querySelectorAll("[data-doc]"));
const sourceLink = document.querySelector(".source-link");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function pathFor(value, base = document.baseURI) {
  return decodeURI(new URL(value, base).pathname);
}

const publishedNotes = links.map((link) => ({
  link,
  path: pathFor(link.dataset.doc),
  route: link.dataset.route || link.hash.slice(1),
}));

function findPublishedNote(target, sourcePath) {
  try {
    const targetPath = pathFor(target, new URL(sourcePath, document.baseURI));
    return publishedNotes.find((note) => note.path === targetPath);
  } catch {
    return undefined;
  }
}

function isSafeHref(href) {
  return !/^\s*(javascript|data|vbscript):/i.test(href);
}

function linkMarkup(label, target, sourcePath, isWikiLink = false) {
  const cleanTarget = target.trim();
  if (!isSafeHref(cleanTarget)) {
    return label;
  }

  const routeTarget = isWikiLink && !/\.[a-z0-9]+(?:#|$)/i.test(cleanTarget)
    ? `${cleanTarget}.md`
    : cleanTarget;
  const note = findPublishedNote(routeTarget, sourcePath);
  if (note) {
    return `<a href="#${escapeAttribute(note.route)}" data-doc-route="${escapeAttribute(note.route)}">${label}</a>`;
  }

  return `<a href="${escapeAttribute(cleanTarget)}">${label}</a>`;
}

function inlineFormat(value, sourcePath) {
  const protectedParts = [];
  const protect = (html) => {
    const index = protectedParts.push(html) - 1;
    return `\u0000${index}\u0000`;
  };

  let text = value.replace(/`([^`]+)`/g, (_match, code) => protect(`<code>${escapeHtml(code)}</code>`));

  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, target) => {
    if (!isSafeHref(target.trim())) {
      return escapeHtml(alt);
    }
    return protect(`<img src="${escapeAttribute(target.trim())}" alt="${escapeAttribute(alt)}" loading="lazy">`);
  });

  text = text.replace(/!\[\[([^\]]+)\]\]/g, (_match, rawTarget) => {
    const [target, label] = rawTarget.split("|");
    const cleanTarget = target.trim();
    if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(cleanTarget) && isSafeHref(cleanTarget)) {
      return protect(`<img src="${escapeAttribute(cleanTarget)}" alt="${escapeAttribute(label || "")}" loading="lazy">`);
    }
    return "";
  });

  text = text.replace(/\[\[([^\]]+)\]\]/g, (_match, rawTarget) => {
    const [target, label] = rawTarget.split("|");
    return protect(linkMarkup(escapeHtml(label || target), target, sourcePath, true));
  });

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, target) =>
    protect(linkMarkup(escapeHtml(label), target, sourcePath));
  );

  text = escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return text.replace(/\u0000(\d+)\u0000/g, (_match, index) => protectedParts[Number(index)]);
}

function parseFrontmatter(markdown) {
  const lines = markdown.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { properties: {}, body: markdown };
  }

  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end < 0) {
    return { properties: {}, body: markdown };
  }

  const properties = {};
  let listProperty = null;
  for (const line of lines.slice(1, end)) {
    const property = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (property) {
      const [, key, rawValue = ""] = property;
      listProperty = null;
      if (!rawValue.trim()) {
        properties[key] = [];
        listProperty = key;
      } else if (rawValue.trim().startsWith("[") && rawValue.trim().endsWith("]")) {
        properties[key] = rawValue.trim().slice(1, -1).split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, ""));
      } else {
        properties[key] = rawValue.trim().replace(/^['"]|['"]$/g, "");
      }
      continue;
    }

    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listProperty && listItem) {
      properties[listProperty].push(listItem[1].trim().replace(/^['"]|['"]$/g, ""));
    }
  }

  return { properties, body: lines.slice(end + 1).join("\n") };
}

function renderMetadata(properties) {
  metadata.replaceChildren();
  const tags = Array.isArray(properties.tags) ? properties.tags : [];
  const statusLabels = {
    active: "진행",
    blocked: "막힘",
    draft: "초안",
    published: "공개",
    review: "검토",
  };

  if (properties.status) {
    const status = document.createElement("span");
    status.className = "note-status";
    status.textContent = statusLabels[properties.status] || properties.status;
    metadata.append(status);
  }

  for (const tag of tags) {
    const badge = document.createElement("span");
    badge.className = "note-tag";
    badge.textContent = `#${tag}`;
    metadata.append(badge);
  }
}

function headingId(value) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-가-힣]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function markdownToHtml(markdown, sourcePath) {
  const { properties, body } = parseFrontmatter(markdown);
  renderMetadata(properties);

  const lines = body.split(/\r?\n/);
  const html = [];
  let inCode = false;
  let listType = null;
  let code = [];

  function closeList() {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  }

  function closeCode() {
    if (inCode) {
      html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      code = [];
      inCode = false;
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

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

    if (line.trim() === "---" || line.trim() === "***") {
      closeList();
      html.push("<hr>");
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      const title = heading[2];
      html.push(`<h${level} id="${escapeAttribute(headingId(title))}">${inlineFormat(title, sourcePath)}</h${level}>`);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      closeList();
      const quoteLines = [];
      while (index < lines.length) {
        const quoteLine = lines[index].match(/^>\s?(.*)$/);
        if (!quoteLine) break;
        quoteLines.push(quoteLine[1]);
        index += 1;
      }
      index -= 1;

      const callout = quoteLines[0]?.match(/^\[!([\w-]+)\]([+-])?\s*(.*)$/);
      if (callout) {
        const [, type, collapse, title] = callout;
        const bodyLines = quoteLines.slice(1);
        html.push(`<aside class="callout callout-${escapeAttribute(type.toLowerCase())}"${collapse ? ` data-collapse="${collapse}"` : ""}>`);
        if (title) html.push(`<p class="callout-title">${inlineFormat(title, sourcePath)}</p>`);
        bodyLines.forEach((quoteLine) => html.push(`<p>${inlineFormat(quoteLine, sourcePath)}</p>`));
        html.push("</aside>");
      } else {
        html.push(`<blockquote>${quoteLines.map((quoteLine) => `<p>${inlineFormat(quoteLine, sourcePath)}</p>`).join("")}</blockquote>`);
      }
      continue;
    }

    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const item = bullet || numbered;
    const nextListType = bullet ? "ul" : numbered ? "ol" : null;
    if (item) {
      if (listType && listType !== nextListType) closeList();
      if (!listType) {
        listType = nextListType;
        html.push(`<${listType}>`);
      }

      const task = item[1].match(/^\[([ xX])\]\s+(.*)$/);
      if (task) {
        const checked = task[1].toLowerCase() === "x" ? " checked" : "";
        html.push(`<li class="task-item"><input type="checkbox" disabled${checked}> ${inlineFormat(task[2], sourcePath)}</li>`);
      } else {
        html.push(`<li>${inlineFormat(item[1], sourcePath)}</li>`);
      }
      continue;
    }

    closeList();
    html.push(`<p>${inlineFormat(line, sourcePath)}</p>`);
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
  content.innerHTML = markdownToHtml(markdown, path);
}

function activateDocument(link, updateHistory = true) {
  links.forEach((item) => item.classList.remove("active"));
  link.classList.add("active");
  sourceLink.href = link.dataset.doc;

  if (updateHistory) {
    const route = link.dataset.route || link.hash.slice(1);
    window.history.pushState(null, "", `#${route}`);
  }

  loadDocument(link.dataset.doc).catch((error) => {
    metadata.replaceChildren();
    content.textContent = error.message;
  });
}

function activateRouteFromLocation() {
  const route = decodeURIComponent(window.location.hash.slice(1));
  const note = publishedNotes.find((item) => item.route === route);
  if (note) activateDocument(note.link, false);
}

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    activateDocument(link);
  });
});

content.addEventListener("click", (event) => {
  const anchor = event.target.closest("a[data-doc-route]");
  if (!anchor) return;

  const note = publishedNotes.find((item) => item.route === anchor.dataset.docRoute);
  if (note) {
    event.preventDefault();
    activateDocument(note.link);
  }
});

window.addEventListener("popstate", activateRouteFromLocation);

const initialRoute = decodeURIComponent(window.location.hash.slice(1));
const initialNote = publishedNotes.find((item) => item.route === initialRoute) || publishedNotes[0];
if (initialNote) activateDocument(initialNote.link, false);
