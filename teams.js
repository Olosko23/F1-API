import * as cheerio from "cheerio";
import fetch from "node-fetch";

async function getNews() {
  const teams = [];

  try {
    const response = await fetch("https://www.formula1.com/en/teams.html");
    const body = await response.text();
    const $ = cheerio.load(body);

    //const wrapper = $('.team-listing')

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
  } catch (error) {
    console.error({ message: error.message });
  }
}

export default getNews;
