import {
  supabase,
} from "../config/supabase";

export async function getAdminEvidenceUrls(
  evidencePaths: string[]
): Promise<string[]> {
  if (
    !evidencePaths ||
    evidencePaths.length === 0
  ) {
    return [];
  }

  const urls: string[] = [];

  for (
    const path of evidencePaths
  ) {
    const {
      data,
      error,
    } =
      await supabase.storage
        .from(
          "incident-evidence"
        )
        .createSignedUrl(
          path,
          300
        );

    if (error) {
      console.error(
        "Evidence signed URL error:",
        error
      );

      continue;
    }

    if (
      data?.signedUrl
    ) {
      urls.push(
        data.signedUrl
      );
    }
  }

  return urls;
}