import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "सुदूर चिनारी — Sudurpashchim Digital News",
    short_name: "सुदूर चिनारी",
    description:
      "सुदूरपश्चिम प्रदेशको अग्रणी डिजिटल पत्रिका — ताजा समाचार, विचार र खोज पत्रकारिता।",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F6F2",
    theme_color: "#05965B",
    icons: [
      {
        src: "/icon.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icon.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
