import express from "express";
import cors from "cors";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const URL = process.env.MONGO_URI;

app.get("/api", (req, res) => {
  try {
    res
      .status(200)
      .json(
        "Home of the API. The API provides data on races, teams and drivers. Add the appropriate endpoint to access each. For drivers the endpoint is .../api/drivers, for teams the endpoint is .../api/teams, and for races the endpoint is .../api/races. "
      );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    const teams = [];
    const response = await fetch("https://www.formula1.com/en/teams.html");
    const body = await response.text();
    const $ = cheerio.load(body);

    $(".team-listing > .row > .col-12").map((i, el) => {
      const name = $(el).find(".f1-color--black").text();
      const rank = $(el).find(".rank").text();
      const points = $(el).find(".points > .f1-wide--s").text();
      const logo = $(el).find(".logo img").attr("data-src");

      teams.push({
        name,
        rank,
        points,
        logo,
      });
    });

    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/drivers", async (req, res) => {
  try {
    const items = [];
    const response = await fetch("https://www.formula1.com/en/drivers.html");
    const body = await response.text();
    const $ = cheerio.load(body);

    //const wrapper = $('.listing-items--wrapper')

    $(".listing-items--wrapper > .row > .col-12").map((i, el) => {
      const rank = $(el).find(".rank").text();
      const points = $(el).find(".points > .f1-wide--s").text();
      const firstName = $(el)
        .find(
          ".col-xs-8.listing-item--name.f1-uppercase > span.d-block.f1--xxs.f1-color--carbonBlack"
        )
        .text();
      const secondName = $(el)
        .find(
          ".col-xs-8.listing-item--name.f1-uppercase > span.d-block.f1-bold--s.f1-color--carbonBlack"
        )
        .text();
      const team = $(el).find(".listing-item--team").text();
      const photo = $(el).find(".listing-item--photo img").attr("data-src");

      //console.log(photo)

      items.push({
        rank,
        firstName,
        secondName,
        points,
        team,
        photo,
      });
    });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/races", async (req, res) => {
  try {
    const dates = [];
    const response = await fetch(
      "https://www.formula1.com/en/racing/2024.html"
    );
    const body = await response.text();

    const $ = cheerio.load(body);

    //const wrapper = $(".current-listing > .container > .completed-events > .col-12 > .event-item-link > .event-item  ");
    //console.log(wrapper.length)
    $(
      ".current-listing > .container > .completed-events > .col-12 > .event-item-link > .event-item > .container > .row > .race-card "
    ).map((i, el) => {
      const place = $(el)
        .find(".event-details  >.event-description > .event-place")
        .text();
      const title = $(el)
        .find(".event-details  > .event-description >.event-title")
        .text();
      const start = $(el)
        .find(
          ".event-info  > .event-space-time > .date-month > .no-margin > .start-date"
        )
        .text();
      const end = $(el)
        .find(
          ".event-info  > .event-space-time > .date-month > .no-margin > .end-date"
        )
        .text();
      const month = $(el)
        .find(".event-info  > .event-space-time > .date-month > .month-wrapper")
        .text();

      //console.log(start, end, month)
      dates.push({ place, title, start, end, month });
    });

    res.status(200).json(dates);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}...`);
});
