import { config } from "../src/core/Config";

const appName = config("app.name", "Reas Vyn");

export default {
	site_name: appName,
	site_title: appName + " | Fullstack Web Developer",
	site_url: "https://reasvyn.github.io",
	job_title: "Fullstack Web Developer",
	social_links: ["https://github.com/reasvyn", "https://linkedin.com/in/reasvyn", "https://x.com/reasvyn"],
};
