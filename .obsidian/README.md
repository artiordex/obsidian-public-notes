<!--
=============================================================================
파일명: README.md
경로: .obsidian/README.md
목적: Obsidian 보트 환경 설정 파일별 한국어 상세 주석 및 운영 가이드 제공함
작성자: AI전략팀
작성일: 2026-10-01
수정일: 2026-10-01
=============================================================================
-->

# Obsidian 보트 환경 설정 가이드

본 문서는 `.obsidian/` 디렉터리 내 환경 설정 파일(JSON)의 역할과 각 속성별 설정 의도를 한국어로 설명함.

> [!NOTE]
> Obsidian의 내부 설정 파일(`*.json`)은 표준 JSON 형식을 사용하므로 파일 내부에 주석(`//` 또는 `/* */`)을 직접 작성할 경우 앱 로딩 시 문법 오류(`SyntaxError`)가 발생함. 따라서 본 문서에서 각 설정 파일의 주석과 설정 기준을 일원화하여 관리함.

---

## 1. 전역 애플리케이션 설정 (`app.json`)

보트 전반의 링크 형식, 기본 폴더 경로, 문서 표기 방식을 제어함.

| 속성명 | 설정값 | 한국어 설명 및 설정 기준 |
| :--- | :--- | :--- |
| `alwaysUpdateLinks` | `true` | 문서 이름 변경 또는 이동 시 연결된 모든 내부 링크를 자동으로 갱신함 |
| `attachmentFolderPath` | `"10 Attachments"` | 붙여넣은 이미지 및 첨부파일을 지정된 전용 폴더에 자동 격리 저장함 |
| `newFileFolderPath` | `"01 Inbox"` | 새 문서 생성 시 임시 수집 폴더인 Inbox에 우선 배치하여 정기 분류를 유도함 |
| `newFileLocation` | `"folder"` | 새 문서의 생성 위치를 특정 폴더(`newFileFolderPath`) 기준으로 고정함 |
| `newLinkFormat` | `"relative"` | 다른 마크다운 뷰어 및 웹 호환성을 위해 상대 경로 링크 생성을 우선함 |
| `propertiesInDocument` | `"visible"` | 문서 상단의 YAML 프론트매터(Properties)를 시각화 위젯 형태로 표시함 |
| `promptDelete` | `true` | 파일 삭제 시 실수로 인한 유실을 방지하기 위해 확인 대화상자를 표시함 |
| `showInlineTitle` | `false` | 마크다운 본문의 최상단 H1 제목과의 중복 표시를 방지하기 위해 인라인 타이틀을 숨김 |
| `strictLineBreaks` | `false` | 일반 마크다운 개행을 유연하게 처리하여 작성 편의성을 높임 |
| `useMarkdownLinks` | `true` | 위키링크(`[[문서]]`) 대신 표준 마크다운 링크(`[문서](경로)`)를 사용하여 GitHub 및 일반 웹 호환성을 유지함 |

---

## 2. 핵심 플러그인 활성화 설정 (`core-plugins.json`)

Obsidian 내장 핵심 기능의 활성화 여부를 관리함. 외부 커뮤니티 플러그인 설치 없이 순수 내장 기능만으로 워크플로우를 구성함.

| 플러그인 식별자 | 활성화 | 주요 기능 및 용도 |
| :--- | :---: | :--- |
| `audio-recorder` | `true` | 음성 녹음 기능 제공함 |
| `backlink` | `true` | 현재 문서를 참조하는 역링크(Backlinks) 패널 표시함 |
| `bases` | `true` | Obsidian 1.8+ 네이티브 데이터베이스 뷰(`09 Bases/`)를 활성화함 |
| `bookmarks` | `true` | 자주 찾는 핵심 문서 북마크 기능 지원함 |
| `canvas` | `true` | 무한 캔버스 기반 시각적 다이어그램 및 아이디어 배치 지원함 |
| `command-palette` | `true` | 단축키(`Ctrl+P` / `Cmd+P`) 기반 명령어 팔레트 제공함 |
| `daily-notes` | `true` | 날짜 기반 일일 업무 일지 자동 생성 및 템플릿 연동함 |
| `file-explorer` | `true` | 좌측 탐색기 트리 뷰 제공함 |
| `file-recovery` | `true` | 로컬 스냅샷 기반 문서 자동 백업 및 복구 지원함 |
| `footnotes` | `true` | 각주 빠른 생성 및 탐색 지원함 |
| `format-converter` | `true` | 타 마크다운/노트 도구와의 형식 변환 기능 제공함 |
| `global-search` | `true` | 보트 전체 전문 검색 기능 제공함 |
| `graph` | `true` | 문서 간 링크 관계를 시각화하는 지식 그래프 뷰 제공함 |
| `note-composer` | `true` | 문서 분할 및 병합 기능 제공함 |
| `outline` | `true` | 현재 문서의 헤더 목차(TOC) 트리 표시함 |
| `outgoing-link` | `true` | 현재 문서에서 외부로 나가는 링크 목록 표시함 |
| `page-preview` | `true` | 링크 마우스 오버 시 문서 내용 미리보기 팝업 제공함 |
| `properties` | `true` | 문서 상단 메타데이터(Properties) 편집 UI 제공함 |
| `publish` | `false` | 상용 Obsidian Publish 기능은 비활성화하고 자체 정적 웹 뷰어 사용함 |
| `random-note` | `true` | 보트 내 임의의 문서를 열람하는 지식 순환 기능 지원함 |
| `slash-command` | `true` | 슬래시(`/`) 입력 시 빠른 서식 및 템플릿 삽입 지원함 |
| `slides` | `true` | 마크다운 기반 프레젠테이션 슬라이드 뷰 제공함 |
| `sync` | `false` | 유료 Obsidian Sync 대신 Git 기반 버전 관리 및 동기화 수행함 |
| `switcher` | `true` | 빠른 파일 전환기(`Ctrl+O` / `Cmd+O`) 제공함 |
| `tag-pane` | `true` | 전체 태그 목록 및 계층형 태그 탐색 패널 제공함 |
| `templates` | `true` | 공통 서식(`08 Templates/`) 삽입 기능 제공함 |
| `zk-prefixer` | `true` | 제텔카스텐 고유 타임스탬프 ID 접두사 생성 지원함 |
| `webviewer` | `true` | 내부 웹 링크 열람 뷰어 제공함 |
| `word-count` | `true` | 하단 상태 표시줄에 글자 수 및 단어 수 표시함 |
| `workspaces` | `true` | 작업 창 레이아웃 저장 및 복원 기능 지원함 |

---

## 3. 데일리 노트 설정 (`daily-notes.json`)

일일 업무 일지 자동 생성 및 양식을 정의함.

- `format`: `"YYYY-MM-DD"` (파일명 날짜 표기 형식임)
- `folder`: `"07 Daily"` (생성된 데일리 노트 저장 폴더 경로임)
- `template`: `"08 Templates/Daily Note.md"` (일일 노트 생성 시 자동 적용할 템플릿 양식임)

---

## 4. 템플릿 설정 (`templates.json`)

문서 생성 시 호출할 템플릿 저장 경로를 정의함.

- `folder`: `"08 Templates"` (프로젝트, 회의록, 결정, OKR, 연구 노트 양식 보관 위치임)

---

## 5. 프로퍼티 타입 정의 (`types.json`)

문서 프론트매터의 속성별 데이터 유형을 정의하여 Obsidian 1.4+ UI에서 올바른 입력 도구(달력, 태그 자동완성 등)를 제공함.

```json
{
  "types": {
    "type": "text",
    "status": "text",
    "date": "date",
    "start_date": "date",
    "target_date": "date",
    "decision_date": "date",
    "review_date": "date",
    "owner": "text",
    "team": "text",
    "project": "text",
    "tags": "tags",
    "priority": "text",
    "period": "text",
    "source": "text",
    "attendees": "list",
    "participant_count": "number",
    "updated": "date"
  }
}
```

---

## 6. 외형 및 한글 폰트 설정 (`appearance.json`)

다크/라이트 모드 대응 및 가독성 높은 한글 시스템 폰트를 지정함.

- `baseFontSize`: `16` (기본 본문 폰트 크기임)
- `theme`: `"system"` (OS 설정에 맞추어 라이트/다크 테마 자동 전환함)
- `interfaceFontFamily`: UI 요소에 `Pretendard`, 시스템 산세리프 폰트를 우선 적용함
- `textFontFamily`: 본문 에디터에 `Pretendard`, 시스템 산세리프 폰트를 우선 적용함
- `monospaceFontFamily`: 코드 블록에 `JetBrains Mono`, `Consolas` 고정폭 폰트를 적용함

---

## 7. 지식 그래프 시각화 설정 (`graph.json`)

지식 간 연결망 분석을 위한 그래프 뷰 기본 필터를 정의함.

- `showTags`: `true` (태그 노드를 그래프에 함께 표시하여 주제별 군집 확인을 지원함)
- `showAttachments`: `false` (이미지·PDF 첨부파일 노드를 제외하여 지식 문서 간 관계에 집중함)
- `hideUnresolved`: `false` (아직 생성되지 않은 링크 대상도 표시하여 지식 확장 지점을 확인함)
- `showOrphans`: `true` (연결선이 없는 고립 문서도 탐색할 수 있도록 노출함)
