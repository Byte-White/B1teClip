# B1teClip
![b1teclip](https://github.com/Byte-White/B1teClip/assets/51212450/ea2a2bc9-8bd9-4c18-9bcb-1ecebe815da8)

Shared Clipboard between multiple devices with real time clipboard update.

![image](https://github.com/Byte-White/B1teClip/assets/51212450/40bb1cd8-f72f-493e-a2a8-a7166b40bdf9)


## How To Setup

Create a FireBase project and create an environment file called `.env.local`

```env
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
```

You can change the firebase rules so it allows only certain people to access your clipboard
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access only to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.email == 'your_email@example.com';
    }
  }
}
```

