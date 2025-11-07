import axios from "axios";
import { processPostsWithVideoDimensions } from './videoUtils';

const apiUrl = "https://www.asasmedia.com/wp-json";

//Axios API call using get
export async function fetchHeroSlider() {
  const response = await axios.get(
    apiUrl + "/custom-api/v1/home-posts-slider",
    {
      timeout: 50000,
    }
  );
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchNewsStrip() {
  const response = await axios.get(
    apiUrl + "/custom-api/v1/home-outlined-posts", {
    timeout: 50000,
  }
  );
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchArticles(isHome, page, categoryId, authorId) {
  let url = apiUrl + "/custom-api/v1/posts?isHome=" + isHome;
  if (page != 0) {
    url = url + "&page=" + page;
  }

  if (categoryId != 0) {
    url = url + "&categoryId=" + categoryId;
  }

  if (authorId != 0) {
    url = url + "&authorId=" + authorId;
  }
  try {
    const response = await axios.get(url, {
      timeout: 50000,
    });

    if (response.status === 200) {
      const data = response.data.data;
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
      throw new Error("Failed to store the push token");
    }
  } catch (error) {
    console.error("Error storing push token:", error);
    throw error;
  }
}

export async function fetchTop5Posts() {
  const response = await axios.get(apiUrl + "/custom-api/v1/top-5-posts", {
    timeout: 50000,
  });
  const dataObject = response.data.data;

  // Process posts to add video dimensions
  const processedPosts = await processPostsWithVideoDimensions(dataObject);

  return processedPosts;
}

export async function fetchAuthors() {
  const response = await axios.get(apiUrl + "/custom/v1/authors", {
    timeout: 50000,
  });
  const dataObject = response.data;

  return dataObject;
}

export async function fetchWhyAsas() {
  const response = await axios.get(apiUrl + "/custom-api/v1/why-asas", {
    timeout: 50000,
  });
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchSocials() {
  const response = await axios.get(apiUrl + "/custom-api/v1/socials", {
    timeout: 50000,
  });
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchDrawerMenu() {
  const response = await axios.get(apiUrl + "/custom-api/v1/mobile-menu", {
    timeout: 50000,
  });
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchArticleSingle(id) {
  const response = await axios.get(apiUrl + "/custom-api/v1/single-post/" + id, {
    timeout: 50000,
  });
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchAuthorsArticles(id, page) {
  const response = await axios.get(
    apiUrl +
    "/wp/v2/posts?_embed&per_page=10&page=" +
    page +
    "&asas_authors=" +
    id, {
    timeout: 50000,
  }
  );
  const dataObject = response.data;

  return dataObject;
}

export async function fetchCategoryChilds(id) {
  const response = await axios.get(
    apiUrl + "/custom-api/v1/category-children?categoryId=" + id,   {
      timeout: 50000,
    }
  );
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchVideos() {
  const response = await axios.get(apiUrl + "/custom-api/v1/videos",   {
    timeout: 50000,
  });
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchSingleVideo(id) {
  const response = await axios.get(
    apiUrl + "/custom-api/v1/single-video/" + id,   {
      timeout: 50000,
    }
  );
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchVideoEpisodes(page, videoId) {
  const response = await axios.get(
    apiUrl +
    "/custom-api/v1/video-episodes?page=" +
    page +
    "&videoId=" +
    videoId,   {
      timeout: 50000,
    }
  );
  const dataObject = response.data.data;

  return dataObject;
}

export async function fetchSearch(page, search, startDate = 0, endDate = 0) {
  let url =
    apiUrl + "/custom-api/v1/search-posts?page=" + page + "&s=" + search;
  if (startDate != 0) {
    url = url + "startDate=" + startDate;
  }

  if (endDate != 0) {
    url = url + "&endDate=" + endDate;
  }

  const response = await axios.get(url,   {
    timeout: 50000,
  });
  const dataObject = response.data.data;

  return dataObject;
}

export async function storePushToken(expoToken) {
  const content = {
    token: expoToken,
  };

  try {
    const response = await axios.post(
      `${apiUrl}/mobile-notifications/v1/tokens`,
      content,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const message = response.data.message;
      return message;
    } else {
      console.error("Error:", response.status, response.statusText);
      throw new Error("Failed to store the push token");
    }
  } catch (error) {
    console.error("Error storing push token:", error);
    throw error;
  }
}

export async function updatePushToken(content) {
  try {
    const response = await axios.post(
      `${apiUrl}/mobile-notifications/v1/tokens`,
      content,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const message = response.data.message;
      return message;
    } else {
      console.error("Error:", response.status, response.statusText);
      throw new Error("Failed to store the push token");
    }
  } catch (error) {
    console.error("Error storing push token:", error);
    throw error;
  }
}

export async function checkExpoTokenIsExist(expoToken) {
  const content = {
    token: expoToken,
  };

  try {
    const response = await axios.post(
      `${apiUrl}/mobile-notifications/v1/token-exists`,
      content,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const exist = response.data.data;
      return exist;
    } else {
      console.error("Error:", response.status, response.statusText);
      throw new Error("Failed to store the push token");
    }
  } catch (error) {
    console.error("Error storing push token:", error);
    throw error;
  }
}

export async function sendMsg(content) {
  try {
    const response = await axios.post(
      `${apiUrl}/custom-api/v1/send-email`,
      content,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const sent = response.data.sent;
      return sent;
    } else {
      console.error("Error:", response.status, response.statusText);
      throw new Error("Failed to store the push token");
    }
  } catch (error) {
    console.error("Error storing push token:", error);
    throw error;
  }
}
