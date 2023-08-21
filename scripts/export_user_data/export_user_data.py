use_saved = True

import requests
import json
import os

from dotenv import load_dotenv
from os.path import exists

load_dotenv()

GITHUB_PAT = os.getenv("GITHUB_PAT")
users = []  # from firebase-users.json
users_data = {}  # from firestore
discord_roles = {
    # parts
    "1002473734067720233": "백엔드",
    "1002473695509499954": "프론트",
    "1002473755399962785": "AI/ML",
    "1018130591570481192": "모바일",
    # study
    "1087184147543511081": "기초-웹-스터디",
    "1087184175951519834": "기초-백엔드-스터디",
    "1087184180615585802": "기초-인공지능-스터디",
    "1087184186357592217": "기초-모바일-스터디",
}

if use_saved:
    with open("users.json", "r") as f:
        users_data = json.loads(f.read())
else:
    from firebase_admin import credentials, firestore, initialize_app

    initialize_app(credentials.Certificate("serviceAccountKey.json"))

    for doc in firestore.client().collection("users").stream():
        users_data[doc.id] = doc.to_dict()

    with open("users.json", "w") as f:
        f.write(json.dumps(users_data))


with open("firebase-users.json", "r") as f:
    for user in json.loads(f.read())["users"]:
        if user["localId"] in users_data:
            users.append(user)
        else:
            print(
                f"ignoring {user['localId']} ({user['email']}). User not found in users.json (most likely they did not use the '/등록' command)"
            )

users_len = len(users)

with open("members.csv", "w") as f:
    f.write(
        f"uid,email,discord_mention,github_handle,github_repo_link,{','.join(discord_roles.values())}\n"
    )

    for i, user in enumerate(users):
        uid = user["localId"]
        email = user["email"]

        print(
            f"({i+1} / {users_len} | {{:.1f}}%)".format((i + 1) / users_len * 100), uid
        )

        r = requests.get(
            f"https://api.github.com/user/{user['providerUserInfo'][0]['rawId']}",
            headers={"Authorization": f"Bearer {GITHUB_PAT}"},
        )

        if r.headers["x-ratelimit-remaining"] == "0":
            print("Reached GitHub API limit. Try again in few minutes.")
            exit(1)

        res = r.json()

        if "message" in res and res["message"] == "Not Found":
            print(json.dumps(res, indent=4))
            print(f"{uid} ({email}) deleted their github account.")

            continue

        user_data = users_data[uid]
        parts = [role in user_data["roles"] for role in discord_roles]

        discordID = user_data["discordID"]
        github_name = res["login"]
        github_link = res["html_url"]

        f.write(
            f"{uid},{email},<@{discordID}>,{github_name},{github_link},{','.join(map(str, parts))}\n"
        )

print("done!")
