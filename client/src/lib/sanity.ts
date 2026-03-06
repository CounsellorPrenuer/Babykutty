import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "xwphlsr2",
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-05-03"
});
