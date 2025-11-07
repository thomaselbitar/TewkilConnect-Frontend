import { Asset } from "expo-asset";
import { Dimensions, Image, PixelRatio } from "react-native";

const screenWidth = Dimensions.get("window").width;

const screenHeight = Dimensions.get("window").height;

const wp = (widthPercent) => {
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);

  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

const hp = (heightPercent) => {
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);

  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

const cacheImages = (images) =>
  images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });

function parseToFloat(value, decimals) {
  const floatValue =
    typeof value === "string" ? parseFloat(value) : Number(value);
  if (isNaN(floatValue)) {
    throw new Error("Invalid input. Unable to parse to float.");
  }
  return floatValue.toFixed(decimals);
}

// This function removes all style attributes and style tags from the HTML
const removeStylesFromHtml = (htmlString) => {
  const $ = cheerio.load(htmlString);

  // Remove all style attributes
  $('[style]').removeAttr('style');

  // Remove all style tags
  $('style').remove();

  // Return the modified HTML
  return $.html();
};

const validateToken = (token) => {
  // Add your validation logic here
  // For example, check if the token is a non-empty string
  return typeof token === 'string' && token.trim() !== '';
};


const timeTo24 = (value, shift = null) => {
  let zv = parseInt(value, 10);

  if (shift === 'PM' && zv < 12) {
    zv += 12;
  }

  if (shift === 'AM' && zv === 12) {
    zv = 0;
  }

  return zv.toString().padStart(2, '0');
}

const timeTo12 = (value) => {
  if (value > 12) {
    return value - 12;
  }
  return value;
}

export { wp, hp, screenWidth, screenHeight, cacheImages, parseToFloat, removeStylesFromHtml, validateToken, timeTo24, timeTo12 };
