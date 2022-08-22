import defaultSettings from "@/settings";

const title = defaultSettings.title || "Management Console";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
