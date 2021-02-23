import axios from "axios";
import { scrapeMetatags } from "../services/webscraper.js";
import moment from "moment";

export const validateUrl = (url) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
};

export const checkUrlsContent = async (url) => {
  const response = await axios.get(url);
  return response.headers["content-type"];
  // thinking of defining uiTypes to render specific components..
};

export const structureNewMessage = async (message) => {
  // this function determines message type, adds metadata, and will webscrape to build a message...
  const messageIsUrl = validateUrl(message);

  const linkPreviewData = messageIsUrl ? await scrapeMetatags(message) : {};
  const type = messageIsUrl ? "link" : "text";
  const url = messageIsUrl ? message : "";
  const date = moment();

  return { type, url, message, date, ...linkPreviewData };
};

export const getLastMessage = (messages) => {
  return messages.length && messages[messages.length - 1];
};

export const getPreviousTime = (lastMessage) => {
  const previousTime =
    lastMessage && lastMessage.content.length
      ? lastMessage.content[lastMessage.content.length - 1].date
      : null;
  return previousTime;
};

export const getMinutesPassed = (previousTime) => {
  const minutesPassed = moment().diff(previousTime, "minutes");
  return minutesPassed;
};

export const decideOnUpdate = (minutesPassed, lastMessage, username) => {
  return (
    minutesPassed < 5 && lastMessage && lastMessage.author.username === username
  );
};

export const addToPreviousMessage = (messages, newMessage) => {
  const lastMessage = messages[messages.length - 1];
  const oldMessageObj = lastMessage.toObject();
  const newMessageToBeUpdated = {
    ...oldMessageObj,
    content: [...(oldMessageObj ? oldMessageObj.content : []), newMessage],
  };
  return newMessageToBeUpdated;
};
