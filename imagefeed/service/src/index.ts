import axios from "axios";
import express from "express";
import ffmpeg from "./ffmpeg";
import puppeteer from "puppeteer";

const PORT = process.env.PORT || 8888;
const API_KEY = "09819e0a74cb43b5cb25692b85869e99";

interface WeatherMain {
  temp: number;
}

interface Weather {
  main: WeatherMain;
}

const streams = {
  Prague: "https://www.skylinewebcams.com/en/webcam/czech-republic/prague/prague/prague.html",
  Rio: "https://www.skylinewebcams.com/en/webcam/brasil/rio-de-janeiro/rio-de-janeiro/copacabana-beach.html",
  Cairo: "",
  "Cape Town": "https://www.skylinewebcams.com/en/webcam/south-africa/western-cape/cape-town/table-mountain.html",
  Casablanka: "",
};

async function getWeatherForCityId(cityId: string) {
  const resp = await axios.get<Weather>(
    `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&APPID=${API_KEY}&units=metric`
  );

  if (!resp.data) return null;

  return resp.data;
}

async function getTemperature(cityId: string) {
  const weather = await getWeatherForCityId(cityId);

  return weather?.main?.temp ?? 0;
}

async function visitSite(url: string) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto(url);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await browser.close();
}

async function getScreenshotFromVideo(pageUrl: string, streamUrl: string, file: string) {
  await visitSite(pageUrl);

  await new Promise((resolve, reject) => {
    ffmpeg(streamUrl)
      .on("end", resolve)
      .on("error", (err: string) => reject(new Error(err)))
      .outputOptions(["-f image2", "-vframes 1", "-vcodec png", "-f rawvideo"])
      .output(`screenshots/${file}`)
      .run();
  });
}

async function grabScreenshots() {
  const entries = Object.entries(streams);

  for (const [key, page] of entries) {
    if (!page) continue;

    try {
      await getScreenshotFromVideo(
        page,
        "https://hddn00.skylinewebcams.com/live.m3u8?a=usvvvvq31ckfqgcpu89c0cqvu5",
        key + ".png"
      );

      console.log(key, "success");
    } catch (error) {
      console.error(error);
    }
  }
}

// https://www.w3schools.com/html/mov_bbb.mp4
grabScreenshots();
// setTimeout(grabScreenshots, 10000);

const app = express();

app.use("/", express.static(__dirname + "/../../"));
app.get("/", async (req, res) => {
  res.sendFile("../index.html", { root: __dirname });
  //res.status(200).send("Hello World");
});

app.get("/temperature/:cityId", async (req, res) => {
  try {
    const temparature = await getTemperature(req.params.cityId);

    res.json(temparature);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/weather/:cityId", async (req, res) => {
  try {
    const weather = await getWeatherForCityId(req.params.cityId);

    res.json(weather);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
