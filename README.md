# Whisper Transcriber App (Mobile)

A **React Native (Expo)** application that connects to a FastAPI backend running Whisper for **live transcription**, **audio**, and **video** file transcription.

---

## Features

- **Live Transcription** from mic
- Upload **audio files** for transcription
- Upload **video files** and extract speech
- All transcription is done **locally** via Whisper — no cloud API usage

---

## 🔧 Getting Started

### 1. Clone the Mobile App

```bash
git clone https://github.com/mbuthimungai/Whisper-Transcriber-App.git
cd Whisper-Transcriber-App/
npm install
```

### 2. Build the App with EAS (iOS only)

> For local iOS testing, you must use EAS to build with the `development` profile:

```bash
eas build --profile development --platform ios
```

This allows debugging on a local iOS simulator or physical device.

> Make sure your device/emulator is running and connected to the same network as the backend.

### 4. Clone the FastAPI Server

You can get the backend from:
[https://github.com/mbuthimungai/Whisper-Transcriber-API](https://github.com/mbuthimungai/Whisper-Transcriber-API)

Follow instructions in the API repo to start the server.

---

## Configuration

Update the backend URL in `app/constants/Constants.ts`:

```ts
export default {
  WS_BASE_URL: "ws://<your-ip>:8000",
  HTTP_BASE_URL: "http://<your-ip>:8000",
};
```

---

## API Usage

| Endpoint            | Method | Description            |
| ------------------- | ------ | ---------------------- |
| `/transcribe/live`  | WS     | Live mic transcription |
| `/transcribe/audio` | POST   | Upload audio file      |
| `/transcribe/video` | POST   | Upload video file      |

---

## Built With

- React Native (Expo)
- `expo-av`, `expo-document-picker`
- WebSocket for live audio

---

## To-Do

- [ ] Improve WebSocket reconnect support
- [ ] Add waveform visual feedback
- [ ] Add offline Whisper (via whisper.cpp)
- [ ] Export .srt / .txt transcripts

---

## Author

**Mbuthi Mungai**
Senior Software Engineer
🔗 [GitHub](https://github.com/mbuthimungai) • [LinkedIn](https://www.linkedin.com/in/mbuthi-mungai/)
