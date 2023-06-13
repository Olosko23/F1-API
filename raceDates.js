import * as cheerio from "cheerio";
import fetch from "node-fetch";

async function getDates() {
  try {
    const response = await fetch(
      "https://www.formula1.com/en/racing/2023.html"
    );
    const body = await response.text();

    const $ = cheerio.load(body);

    //const wrapper = $(".current-listing > .container > .completed-events > .col-12 > .event-item-link > .event-item  ");
    //console.log(wrapper.length)
    const dates = [];
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
        .find(".event-info  > .event-space-time > .date-month > .no-margin > .start-date")
        .text();
      const end = $(el)
        .find(".event-info  > .event-space-time > .date-month > .no-margin > .end-date")
        .text();
      const month = $(el)
        .find(".event-info  > .event-space-time > .date-month > .month-wrapper")
        .text();

        //console.log(start, end, month)
      dates.push({ place, title, start, end, month });
    });
  } catch (error) {
    console.error({ message: error.message });
  }
}

export default getDates;
