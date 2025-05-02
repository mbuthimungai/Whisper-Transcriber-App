import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import Constants from "../../constants/Constants";
import { Buffer } from "buffer";

const WS_URL = `${Constants.WS_BASE_URL}/transcribe/live/`;

export default function LiveTranscribeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        console.log("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      recordingRef.current = recording;

      // Initialize WebSocket
      wsRef.current = new WebSocket(WS_URL);
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.text) {
          setTranscripts((prev) => [...prev, data.text]);
        }
      };
      wsRef.current.onerror = (e) => {
        console.error("WebSocket error:", e);
      };

      // Start sending audio chunks
      intervalRef.current = setInterval(sendAudioChunk, 3000);

      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };
  const sendAudioChunk = async () => {
    if (recordingRef.current && wsRef.current) {
      try {
        const uri = recordingRef.current.getURI();
        if (!uri) return;

        const response = await fetch(uri);
        const blob = await response.blob();
        console.log("blob ", blob);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result?.toString().split(",")[1];
          if (base64data) {
            const buffer = Buffer.from(base64data, "base64");
            wsRef.current?.send(buffer);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error sending audio chunk:", error);
      }
    }
  };
  // const sendAudioChunk = async () => {
  //   if (recordingRef.current && wsRef.current) {
  //     try {
  //       const uri = recordingRef.current.getURI();
  //       if (!uri) return;

  //       const response = await fetch(uri);
  //       const blob = await response.blob();
  //       console.log(blob);
  //       const arrayBuffer = await blob.arrayBuffer();

  //       wsRef.current.send(arrayBuffer);
  //     } catch (error) {
  //       console.error("Error sending audio chunk:", error);
  //     }
  //   }
  // };

  const stopRecording = async () => {
    setIsRecording(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
      recordingRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 Live Whisper Transcription</Text>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <ScrollView style={styles.transcript}>
        {transcripts.map((line, index) => (
          <Text key={index} style={styles.line}>
            {line}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  transcript: {
    marginTop: 20,
  },
  line: {
    fontSize: 16,
    marginBottom: 10,
  },
});
