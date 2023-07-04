# GDSC Open Community

[turborepo](https://turbo.build/repo)를 이용해 관리되는 monorepo입니다.

다음을 포함하고 있습니다:

- `apps/discord-bot` - GDSC OC 디스코드 봇
- `apps/website` - [https://oc.gdschongik.com](https://oc.gdschongik.com)
- `packages/github` - [GitHub](https://github.com) API wrapper

## 개발 세팅

- [vscode](https://code.visualstudio.com) IDE 사용을 권장합니다

1. Node 18 (hydrogen) 설치

2. yarn CLI 설치

3. Turborepo CLI 설치

   - https://turbo.build/repo/docs/installing

4. 프로젝트 빌드

   - 몇몇 IDE 기능을 위해 필요한 단계입니다

   ```
   yarn build
   ```

5. 모든 프로젝트 실행

   - 환경 변수 등의 이유로 에러 발생 시 해당 프로젝트의 `README.md` 파일를 참고하세요

   ```
   yarn dev
   ```

## 필요한 주요 지식/기술

- Turborepo
- yarn CLI
- nodejs
- TypeScript
- ESLint
- firebase (auth, firestore)
- DigitalOcean
- Docker
- github Action

## 기여

- 커밋시 [conventional commit](https://conventionalcommits.org)을 사용해주세요
