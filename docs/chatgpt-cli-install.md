# ChatGPT CLI 설치 방법

작성일: 2026-08-31

## 용어 정리

OpenAI가 공식 문서에서 안내하는 터미널용 ChatGPT/Codex 도구의 이름은 **Codex CLI**입니다. 터미널에서 `codex` 명령으로 실행하며, 로컬 저장소를 읽고 수정하고 명령을 실행하는 코딩 에이전트입니다.

공식 문서:
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)
- [Authentication](https://learn.chatgpt.com/docs/auth)

## 1. 설치

macOS 또는 Linux에서는 공식 설치 스크립트를 실행합니다.

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

업데이트도 같은 명령으로 처리할 수 있습니다.

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

## 2. 실행

작업할 프로젝트 폴더로 이동한 뒤 `codex`를 실행합니다.

```bash
cd /path/to/project
codex
```

처음 실행하면 로그인 방식 선택 화면이 나옵니다. 일반 사용자는 **Sign in with ChatGPT**를 선택하면 됩니다.

## 3. 로그인

브라우저 로그인 방식은 다음 명령으로 시작할 수 있습니다.

```bash
codex login
```

브라우저가 열리면 ChatGPT 계정으로 로그인하고, 다시 터미널로 돌아오면 인증이 완료됩니다.

API 키로 로그인해야 하는 환경에서는 `OPENAI_API_KEY`를 환경변수로 둔 뒤 stdin으로 전달합니다.

```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```

API 키 방식은 사용량이 OpenAI Platform 계정의 API 요금으로 과금됩니다. 일반 로컬 작업에서는 ChatGPT 로그인 방식이 더 단순합니다.

## 4. 설치 확인

버전 또는 도움말이 출력되는지 확인합니다.

```bash
codex --version
codex --help
```

현재 인증 상태는 다음 명령으로 확인합니다.

```bash
codex login status
```

로그아웃은 다음 명령을 사용합니다.

```bash
codex logout
```

## 5. 첫 사용 예시

프로젝트 루트에서 다음처럼 요청합니다.

```text
이 프로젝트 구조를 설명해줘
```

또는 비대화형 작업에는 `codex exec`를 사용할 수 있습니다.

```bash
codex exec "테스트 실패 원인을 찾아줘"
```

## 6. 운영 팁

- 작업 전후로 git 커밋을 만들어 두면 변경사항을 되돌리기 쉽습니다.
- 민감한 값은 `.env`나 셸 환경변수로 관리하고, 저장소에 커밋하지 않습니다.
- 권한 설정은 작업 성격에 맞게 조정합니다. 읽기 위주 조사, 자동 편집, 명령 실행 자동화는 위험도가 다릅니다.
- CI/CD 같은 자동화 환경에서는 브라우저 로그인이 아니라 API 키나 조직에서 허용한 자동화용 인증 방식을 검토합니다.

## 빠른 명령 모음

```bash
# 설치 또는 업데이트
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# 실행
codex

# ChatGPT 계정으로 로그인
codex login

# API 키로 로그인
printenv OPENAI_API_KEY | codex login --with-api-key

# 인증 상태 확인
codex login status

# 로그아웃
codex logout
```
