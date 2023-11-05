import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { PublicDateRange } from "./../components/calendar/types";
import { GraphqlCategory } from "./../graphql/types/category";
import dayjs, { Dayjs } from "dayjs";
import isUrl from "is-url";
import { MAX_WORDS } from "./constants";

export function getDate() {
  const month_day = new Date().toISOString().slice(5, 10).split("-");
  const monthNumber = parseInt(month_day[0]);
  const day = month_day[1];
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return day + " " + date.toLocaleString("en-US", { month: "long" });
}


export async function fixImageAndCategories(
  post: any,
  dateTime: PublicDateRange,
  isArticle = false,
  editId: string | string[] | undefined
) {
  let image;
  image = await uploadLocalFiles(post.image);

  let result;
  if (!dateTime || !dateTime.start || !dateTime.end)
    throw new Error("Date time not valid");

  if (editId && isArticle) {
    result = {
      title: post.title,
      content: JSON.stringify(await convertLocalImages(post.content)),
      image: image,
      readTime: calculateReadTime(extractTextFromContent(post.content)),
      categories: post.categories,
      id: editId,
    };
  } else if (editId && !isArticle) {
    result = {
      title: post.title,
      content: JSON.stringify(post.content),
      image: image,
      categories: post.categories,
      id: editId,
    };
  } else if (isArticle && !editId) {
    result = {
      title: post.title,
      content: JSON.stringify(await convertLocalImages(post.content)),
      image: image,
      readTime: calculateReadTime(extractTextFromContent(post.content)),
      categories: post.categories,
      postDate: dayjs(dateTime.start).format("YYYY-MM-DD").toString(),
      postTime: dayjs(dateTime.start).format("HH:mm:10.0").toString(),
    };
  } else if (!isArticle && !editId) {
    result = {
      title: post.title,
      content: JSON.stringify(post.content),
      image: image,
      categories: post.categories,
      postDate: dayjs(dateTime.start).format("YYYY-MM-DD").toString(),
      postTime: dayjs(dateTime.start).format("HH:mm:10.0").toString(),
    };
  }
  return {
    variables: {
      type: result,
    },
  };
}

export async function uploadLocalFiles(image: string) {
  if (image?.slice(0, 4) != "blob") {
    return image;
  }
  const data = new FormData();
  const file = await fetch(image)
    .then((r) => r.blob())
    .then(
      (blobFile) =>
        new File([blobFile], Date.now().toString(), { type: blobFile.type })
    );
  data.append(file.name, file);
  const response = await fetch(
    `https://www.filestackapi.com/api/store/S3?key=${process.env.NEXT_PUBLIC_FILE_STACK}`,
    {
      method: "POST",
      body: await file.arrayBuffer(),
      headers: {
        "Content-Type": file.type,
      },
    }
  );
  if (response.ok) {
    const text = await response.json();
    return text.url;
  } else {
    toast.error("failed to send the image");
  }
}

export function handleImageType(image: string | undefined | null) {
  if (image == undefined || typeof image == "object" || !image) return "";
  if (image.slice(0, 4) == "blob") return image;
  if (isUrl(image)) {
    return image;
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL + "/file/download/" + image;
}

export function getTextLength(content: any) {
  let words = 0;
  if (!content) return 0;
  for (let i = 0; i < content.length; i++) {
    for (
      let textIndex = 0;
      textIndex < content[i].children.length;
      textIndex++
    ) {
      words += content[i].children[textIndex].text.length;
    }
  }
  return words;
}

export function textCrop(content: any) {
  let words = 0;
  let croppedValue = [];
  if (!content) return [];
  if (getTextLength(content) <= MAX_WORDS) {
    return content;
  }
  for (let i = 0; i < content.length; i++) {
    let childrens = [];
    for (
      let textIndex = 0;
      textIndex < content[i].children.length;
      textIndex++
    ) {
      words += content[i].children[textIndex].text.length;
      if (words <= MAX_WORDS) {
        childrens.push(content[i].children[textIndex]);
      } else {
        const truncateText =
          content[i].children[textIndex].text.slice(0, MAX_WORDS - words) +
          "...";
        childrens.push({
          text: truncateText,
          bold: content[i].children[textIndex].bold,
          italic: content[i].children[textIndex].italic,
          underline: content[i].children[textIndex].underline,
        });
        break;
      }
    }
    croppedValue.push({ type: "p", children: childrens });
    if (words > MAX_WORDS) {
      return croppedValue;
    }
  }
  return croppedValue;
}

export function extractTextFromContent(content: any) {
  let extractedText = "";
  for (let i = 0; i < content.length; i++) {
    if (content[i].type == "p") {
      for (let j = 0; j < content[i].children.length; j++) {
        extractedText += content[i].children[j].text;
      }
    }
  }

  return extractedText;
}
/**
 * upload blob images article content to server from  
 * @param content 
 * @returns 
 */
export async function convertLocalImages(content: any) {
  let result = [];
  for (let i = 0; i < content.length; i++) {
    if (content[i].type == "image") {
      result.push({
        type: "image",
        url: await uploadLocalFiles(content[i].url),
        children: [{ text: "" }],
      });
    } else {
      result.push(content[i]);
    }
  }

  return result;
}

export function calculateReadTime(text: string) {
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
}

export function getIndexIds(content: any) {
  let array: string[] = [];
  if (!content) return array;
  content.map(
    (value: any) =>
      (value.type === "h1" || value.type === "h2") &&
      /**
       * @ts-ignore*/
      array.push(hashFnv32a(value?.children[0].text, true, 32))
  );
  return array;
}
import { Network } from "@capacitor/network";
import { toast } from "react-toastify";

export const checkInternetConnection = async () => {
  const status = await Network.getStatus();
  return status.connected;
};
/**
 * takes a ids string[] and convert it to category standard {id, name, image}
 * @param ids
 * @param allCategories
 * @returns
 */
export function convertIdToCategories(
  ids: string[],
  allCategories: GraphqlCategory[]
) {
  let temp = [];
  for (let i = 0; i < allCategories.length; i++) {
    for (let j = 0; j < ids.length; j++)
      if (ids[j] == allCategories[i].id) {
        temp.push(allCategories[i]);
      }
  }
  return temp;
}

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
export function hashFnv32a(str: string, asString: boolean, seed: number) {
  /*jshint bitwise:false */
  var i,
    l,
    hval = seed === undefined ? 0x811c9dc5 : seed;

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval +=
      (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  if (asString) {
    // Convert to 8 digit hex string
    return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
  }
  return hval >>> 0;
}

export const delay = (ms: number, callBack?: () => void) =>
  new Promise((resolve) => setTimeout(callBack ? callBack : resolve, ms));

export function extractIdFromCategories(categories: GraphqlCategory[]) {
  let temp = [];
  for (let i = 0; i < categories.length; i++) {
    temp.push(categories[i].id);
  }
  return temp;
}

export function checkIfAlreadyFollowed(
  authors: string[] | undefined,
  uid: string
) {
  if (authors === undefined) return false;

  for (let i = 0; i < authors.length; i++) {
    if (authors[i] == uid) {
      return true;
    }
  }

  return false;
}
