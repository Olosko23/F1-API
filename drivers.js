import * as cheerio from "cheerio";
import fetch from "node-fetch";

async function getDrivers() {
  try {
    const response = await fetch("https://www.formula1.com/en/drivers.html");
    const body = await response.text();
    const $ = cheerio.load(body);

    //const wrapper = $('.listing-items--wrapper')

    const items = [];
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
  } catch (error) {
    console.error({ message: error.message });
  }
}

export default getDrivers;
