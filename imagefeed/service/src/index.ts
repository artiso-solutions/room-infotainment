import axios from "axios";
import express from "express";

const PORT = 8080;
const API_KEY = "09819e0a74cb43b5cb25692b85869e99";

interface WeatherMain {
  temp: number;
}

interface Weather {
  main: WeatherMain;
}

async function getTemperature(cityId: string) {
  const resp = await axios.get<Weather>(
    `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&APPID=${API_KEY}&units=metric`
  );

  if (!resp.data) return 0;

  return resp.data.main.temp;
}

const app = express();

app.get("/temperature/:cityId", async (req, res) => {
  try {
    const temparature = await getTemperature(req.params.cityId);

    res.json(temparature);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
