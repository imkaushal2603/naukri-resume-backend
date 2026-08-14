import fs from "fs";
import path from "path";

export const loadTemplate = (templateKey: string): string => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "templates",
    templateKey,
    "template.html"
  );
  return fs.readFileSync(filePath, "utf-8");
};

export const replace = (template: string, key: string, value: string): string => {
  const placeholder = new RegExp(`{{${key}}}`, "g");
  return template.replace(placeholder, value || "");
};