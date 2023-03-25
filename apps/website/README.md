# GDSC Open Community 웹사이트

GDSC 홍익 오픈 커뮤니티 회원가입을 위해 Digital Ocean App Platform에 배포된 SvelteKit 앱입니다.

## 개발 세팅

1. [Node.JS](https://nodejs.org) 설치

2. 종속 항목 설치

   ```
   yarn install
   ```

3. Firebase 셋업

   1. 프로젝트 셋업

      1. [Firebase console](https://console.firebase.google.com)에서 프로젝트를 생성

      2. Authentication > Sign-in method에서 GitHub provider를 활성화 (GitHub OAuth Application 생성 필요)

   2. Firebase CLI 설치

      ```
      yarn install -g firebase-tools
      ```

   3. Firebase CLI 로그인

      ```
      firebase login
      ```

   4. `apps/website` 디렉토리에서 다음을 실행하여 사용할 Firebase 프로젝트를 선택

      ```
      firebase use
      ```

4. `.env` 파일 생성

   - `PRIVATE_FB_PRIVATE_KEY` 등 띄어쓰기가 포함된 데이터는 따옴표로 감싸야 합니다.

   - Firebase project general settings에서 web app을 생성한 후 `firebaseConfig` 정보를 `PUBLIC_FB_`에 붙여넣으세요.
     ([이 링크](https://console.firebase.google.com/u/0/project/_/settings/general)를 클릭하신 후 프로젝트를 선택하면 해당 페이지로 이동합니다)

   - Firebase project settings에서 service account private key를 생성한 후 정보를 `PRIVATE_FB_...`에 붙여넣으세요.
     ([이 링크](https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk)를 클릭하신 후 프로젝트를 선택하면 해당 페이지로 이동합니다)

   ```dosini
   PUBLIC_FB_API_KEY=
   PUBLIC_FB_AUTH_DOMAIN=
   PUBLIC_FB_PROJECT_ID=
   PUBLIC_FB_STORAGE_BUCKET=
   PUBLIC_FB_MESSAGING_SENDER_ID=
   PUBLIC_FB_APP_ID=
   PUBLIC_FB_MEASUREMENT_ID=

   PRIVATE_FB_PRIVATE_KEY_ID=
   PRIVATE_FB_PRIVATE_KEY=
   PRIVATE_FB_CLIENT_EMAIL=
   PRIVATE_FB_CLIENT_ID=
   PRIVATE_FB_AUTH_URI=
   PRIVATE_FB_TOKEN_URI=
   PRIVATE_FB_AUTH_PROVIDER_X509_CERT_URL=
   PRIVATE_FB_CLIENT_X509_CERT_URL=
   ```

5. [http://localhost:5173](http://localhost:5173)에서 실행

   ```
   yarn dev
   ```

6. Production build 생성

   ```
   yarn build
   ```

7. Production build 실행

   ```
   node build/index.js
   ```

## production 세팅

1.  Digital Ocean App Platform에서 App 생성

    - GitHub repository에서 deploy

    - 환경 변수 설정

    - 빌드 커맨드

      ```
      cd apps/website && yarn build
      ```

    - 실행 명령어

      ```
      apps/website && PORT=80 node build/index.js
      ```

    - [App spec](https://docs.digitalocean.com/glossary/app-spec)

      - environment variable 정보를 채운 후 사용하세요

      ```yaml
      alerts:
      - rule: DEPLOYMENT_FAILED
      - rule: DOMAIN_FAILED
      domains:
      - domain: oc.gdschongik.com
         type: PRIMARY
      ingress: {}
      name: website
      region: sgp
      services:
      - build_command: cd apps/website && yarn build
         environment_slug: node-js
         envs: <비밀>
         github:
            branch: master
            deploy_on_push: true
            repo: GDSC-Hongik/GDSC-OC
         http_port: 80
         instance_count: 1
         instance_size_slug: basic-xxs
         name: website
         routes:
            - path: /
         run_command: cd apps/website && PORT=80 node build/index.js
         source_dir: /apps/website
      ```
