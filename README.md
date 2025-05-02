# Whisper-Transcriber-App
A React Native + FastAPI application for live and file-based speech transcription using locally installed OpenAI Whisper models.

---

##  Features

- **Live Mic Transcription**  
  Speak into your phone — the audio is streamed to a FastAPI backend running Whisper and transcribed in real-time.

- **Audio File Upload**  
  Upload `.wav`, `.mp3`, or similar audio files for fast, accurate transcription.

- **Video File Upload**  
  Upload video files (e.g. `.mp4`), and the app will extract audio and return a transcript of everything spoken.

- **Private & Local**  
  All transcription is done **on-device/server** using a locally installed Whisper model — no external APIs required.

---

## Tech Stack

| Layer            | Tech                              |
|------------------|-----------------------------------|
| Mobile Frontend  | React Native (Expo)               |
| Backend API      | FastAPI                           |
| Transcription    | [Whisper](https://github.com/openai/whisper) or [whisper.cpp](https://github.com/ggerganov/whisper.cpp) |
| Audio Extraction | `ffmpeg` (for video to audio)     |
| Streaming        | WebSockets / HTTP chunked transfer |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mbuthimungai/Whisper-Transcriber-App.git
cd Whisper-Transcriber-App
```

### 2. Start the FastAPI server

> **Requirements:** Python 3.1-+, `ffmpeg`, Whisper or `whisper.cpp`

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- For Whisper (Python):
  ```
  pip install git+https://github.com/openai/whisper.git
  ```

- For `whisper.cpp`:
  - Compile the C++ binary
  - Use subprocess in Python to call it from FastAPI

### 3. Start the React Native app

```bash
cd app
npm install
npx expo start
```

---

## API Endpoints

| Endpoint               | Method | Description                     |
|------------------------|--------|---------------------------------|
| `/transcribe/live`     | WS     | Streams mic input for live text |
| `/transcribe/audio`    | POST   | Uploads audio file              |
| `/transcribe/video`    | POST   | Uploads video file              |

---

## Roadmap

- [ ] Add speaker diarization support
- [ ] Add subtitles (.srt/.vtt) export
- [ ] Add support for multiple languages
- [ ] Offline mode in mobile app
- [ ] Local caching of transcripts

---

## Author

**Mbuthi Mungai**  
Senior Software Engineer  
[GitHub](https://github.com/mbuthimungai) • [LinkedIn](https://www.linkedin.com/in/mbuthi-mungai/)  
