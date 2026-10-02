import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

import { decode } from "base64-arraybuffer";

import { supabase } from "../config/supabase";

import type {
  IncidentEvidence,
} from "../types/incident";

const MAX_EVIDENCE_IMAGES = 3;

export async function pickIncidentEvidence(
  currentCount: number
): Promise<IncidentEvidence[]> {
  const remaining =
    MAX_EVIDENCE_IMAGES -
    currentCount;

  if (remaining <= 0) {
    throw new Error(
      "You can attach a maximum of 3 photos."
    );
  }

  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Photo library permission is required to add evidence."
    );
  }

  const result =
    await ImagePicker.launchImageLibraryAsync(
      {
        mediaTypes: ["images"],
        allowsMultipleSelection:
          true,
        selectionLimit:
          remaining,
        quality: 0.8,
      }
    );

  if (result.canceled) {
    return [];
  }

  return result.assets.map(
    (asset) => ({
      uri: asset.uri,
      fileName:
        asset.fileName ??
        null,
      mimeType:
        asset.mimeType ??
        "image/jpeg",
    })
  );
}

export async function uploadIncidentEvidence(
  evidence: IncidentEvidence[]
): Promise<string[]> {
  const uploadedPaths:
    string[] = [];

  for (
    const item of evidence
  ) {
    const base64 =
      await FileSystem.readAsStringAsync(
        item.uri,
        {
          encoding:
            FileSystem
              .EncodingType
              .Base64,
        }
      );

    const extension =
      getExtension(
        item.fileName,
        item.mimeType
      );

    const randomId =
      Math.random()
        .toString(36)
        .substring(2, 10);

    const filePath =
      `reports/${Date.now()}-${randomId}.${extension}`;

    const {
      error,
    } =
      await supabase.storage
        .from(
          "incident-evidence"
        )
        .upload(
          filePath,
          decode(base64),
          {
            contentType:
              item.mimeType ??
              "image/jpeg",
            upsert: false,
          }
        );

    if (error) {
      console.error(
        "Evidence upload error:",
        error
      );

      throw new Error(
        "Unable to upload incident evidence."
      );
    }

    uploadedPaths.push(
      filePath
    );
  }

  return uploadedPaths;
}

function getExtension(
  fileName:
    | string
    | null,
  mimeType:
    | string
    | null
) {
  if (
    fileName &&
    fileName.includes(".")
  ) {
    return (
      fileName
        .split(".")
        .pop()
        ?.toLowerCase() ??
      "jpg"
    );
  }

  if (
    mimeType ===
    "image/png"
  ) {
    return "png";
  }

  if (
    mimeType ===
    "image/webp"
  ) {
    return "webp";
  }

  return "jpg";
}