# Obsidian Public Notes

This repository is an Obsidian vault starter for a small startup team. It includes linked workflows for company knowledge, projects, meetings, decisions, OKRs, and daily notes. A small selection of public notes is also published as a static GitHub Pages site.

## Open the vault

In Obsidian, choose **Open folder as vault** and select this repository folder. The checked-in `.obsidian` settings enable the built-in plugins and set up the inbox, templates, daily notes, and attachment folder.

Start at [`00 Home.md`](00%20Home.md), then read [`02 Company/Operating Handbook.md`](02%20Company/Operating%20Handbook.md).

## Team workflow

- Capture untriaged ideas in `01 Inbox/` and review them during a weekly review.
- Track each initiative in `03 Projects/` with one accountable owner, an outcome, measures, and a status.
- Use `04 Meetings/` for meeting records and link each record to its project and resulting decisions.
- Record durable choices in `05 Decisions/` and link them from the affected project or meeting.
- Keep reusable guidance in `06 Knowledge/` and `docs/`.
- Use the native Bases in `09 Bases/` to browse project, meeting, decision, OKR, user research, and knowledge notes by their Properties.
- Keep execution tasks in the team's issue tracker; link them from Obsidian so ownership and due dates remain in the system that runs the work.

To create a project, meeting, decision, OKR, research, or knowledge note, create a new note in its destination folder (or in the inbox and move it later), then run **Templates: Insert template** from the command palette (`Ctrl+P`). Daily notes use their template automatically. Templates use Obsidian's built-in placeholders and structured Properties, so no community plugin is required for the starter workflow.

## Public repository boundary

This GitHub repository is public. Treat every committed file as public, even if it is not listed on the website. Do not put confidential strategy, customer or employee personal data, credentials, private meeting notes, or unreleased product information here. Use a private vault/repository for internal company work and publish only reviewed notes from it.

## Local Preview

Open `index.html` through a static file server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Repository layout

- `00 Home.md`: team knowledge hub and Base views
- `01 Inbox/`: untriaged captures
- `02 Company/`: operating handbook and company-level reference
- `03 Projects/`, `04 Meetings/`, `05 Decisions/`, `06 Knowledge/`, `07 Daily/`: working note areas
- `08 Templates/`: project, meeting, decision, OKR, user research, knowledge, and daily-note templates
- `09 Bases/`: native Obsidian Base views
- `10 Attachments/`: note images, PDFs, and other attachments
- `docs/`: reviewed notes selected for the public website

The `.obsidian` folder contains vault-wide preferences and enables built-in features such as Backlinks, Graph view, Properties, Bases, Canvas, Templates, Daily notes, and File recovery. Machine-specific workspace layouts are excluded from Git.

Community plugins are intentionally not preinstalled. Obsidian's built-in features cover the current workflows; see the operating handbook before adding plugins to a company vault.
