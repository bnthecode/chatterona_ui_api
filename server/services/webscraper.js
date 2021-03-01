import axios from "axios";
import cheerio from "cheerio";

export const scrapeMetatags = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    return {
      title1:
        $("title").text() ||
        "Unknown",
      title2: $("head title").text() || "Unknown",
      description: $('meta[name="description"]').attr("content") || "Unknown",
      icon:
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="apple-touch-icon"]').attr("href") ||
        $("meta[property='og:image']").attr("content") ||
        $('link[rel="img_src"]').attr("href") ||
        $("link").attr("href") ||
        $("meta[name='msapplication-TileImage']").attr("content") ||
      
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
};
