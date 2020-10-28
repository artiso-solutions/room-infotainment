import axios from "axios";
import express from "express";

const PORT = process.env.PORT || 8080;
const API_KEY = "09819e0a74cb43b5cb25692b85869e99";

interface WeatherMain {
  temp: number;
}

interface Weather {
  main: WeatherMain;
}

/*
City code:
Prag=>3067696
Rio=>3451189
Kairo=>360630
Kapstadt=>3369157
Casablanka=>3687209
*/

async function getTemperature(cityId: string) {
  const resp = await axios.get<Weather>(
    `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&APPID=${API_KEY}&units=metric`
  );

  if (!resp.data) return 0;

  return resp.data.main.temp;
}
async function getWeather(cityId: string) {
  const resp = await axios.get<Weather>(
    `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&APPID=${API_KEY}&units=metric`
  );

  if (!resp.data) return 0;

  return resp.data;
}

const app = express();

app.use("/", express.static(__dirname + "/../../"));
// app.get("/", async (req, res) => {
//   res.sendFile("../index.html", { root: __dirname + "/../../" });
//   //res.status(200).send("Hello World");
// });

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
    const temparature = await getWeather(req.params.cityId);

    res.json(temparature);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
