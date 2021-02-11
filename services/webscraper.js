import axios from "axios";
import cheerio from "cheerio";

export async function scrapeMetatags(url) {
  try {
    const response = await axios.get(url);
    const $ = await cheerio.load(response.data);
    let data = [];

    return {
      title1: $("title").text() || "Unknown",
      title2: $("head title").text() || "Unknown",
      description: $('meta[name="description"]').attr("content") || "Unknown",
      icon:
        $('link[rel="icon"]').attr("href") ||
        $("meta[property='og:image']").attr("content") ||
        $('link[rel="img_src"]').attr("href") ||
        "Unknown",
      site: $("meta[property='og:site_name']").attr("content") || "Unknown",
      img: $("meta[property='og:image']").attr("content") || "Unknown",
      videoUrl: $("video").attr("src") || "Unknown",
      type: response.headers["content-type"] || "Unknown",
    };
  } catch (err) {
    return {
      title: "Unknown",
      description: "Unknown",
    };
  }
}
