# 사용자 정보 내보내기 스크립트

## 세팅

1. 파이썬 가상 환경 만들기
   ```
   python -m venv venv
   ```
2. 파이썬 가상 환경 활성화
   - UNIX shell:
     ```
     source ./venv/bin/activate
     ```
   - cmd:
     ```
     venv\Scripts\activate.bat
     ```
   - powershell:
     ```
     venv\Scripts\Activate.ps1
     ```
3. 의존성 설치
   ```
   pip install -r requirements.txt
   ```
4. Firebase CLI 설치
   ```
   npm install -g firebase-tools
   ```
5. 다음 명령어를 실행하여 `firebase-users.json` 파일 생성
   ```
   firebase auth:export firebase-users.json --format=json --project gdsc-oc
   ```
6. [여기](https://console.firebase.google.com/u/0/project/gdsc-oc/settings/serviceaccounts/adminsdk)에서 private key 생성 후 `serviceAccountKey.json`에 저장
7. 깃헙 PAT를 `.env` 파일에 저장
   ```
   GITHUB_PAT=<깃헙 PAT>
   ```
8. 스크립트 실행
   ```
   python export_user_data.py
   ```
