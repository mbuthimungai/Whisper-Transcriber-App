import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Constants from "../../constants/Constants";
const API_URL = Constants.API_BASE_URL;

const FileUploadScreen = () => {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickAndUploadFile = async () => {
    setTranscript(null);
    setLoading(true);

    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/*", "video/*"],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || !result.assets[0]) {
      setLoading(false);
      return;
    }

    const file = result.assets[0];
    const uri = file.uri;
    const name = file.name;
    const type = file.mimeType || "audio/wav";

    const formData = new FormData();
    formData.append("file", {
      uri,
      name,
      type,
    } as any);

    try {
      const endpoint = type.startsWith("video/")
        ? `${API_URL}/transcribe/video/`
        : `${API_URL}/transcribe/audio/`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const json = await response.json();
      if (json.transcription) {
        setTranscript(json.transcription);
      } else {
        setTranscript("⚠️ Error: " + (json.detail || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setTranscript("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="📁 Pick Audio/Video File" onPress={pickAndUploadFile} />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      <ScrollView style={styles.result}>
        {transcript && <Text style={styles.transcript}>{transcript}</Text>}
      </ScrollView>
    </View>
  );
};

export default FileUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  result: {
    marginTop: 20,
  },
  transcript: {
    fontSize: 16,
    lineHeight: 22,
  },
});
