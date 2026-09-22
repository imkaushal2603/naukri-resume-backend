import fs from "fs";
import path from "path";

export const loadTemplate = (templateKey: string, type: "resumes" | "cover-letter" = "resumes"): string => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "templates",
    type,
    templateKey,
    "template.html"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const replace = (template: string, key: string, value: string): string => {
  const placeholder = new RegExp(`{{${key}}}`, "g");
  return template.replace(placeholder, value || "");
};