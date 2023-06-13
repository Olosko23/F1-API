import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
//import getDrivers from './drivers.js';
//import getNewss from "./teams.js";
//import getDates from "./raceDates.js";
import * as cheerio from "cheerio";
import fetch from "node-fetch";


const app = express();
const PORT = 8000 || 5000;
const URL = "mongodb+srv://oloo:oloo@quotes.brpwvom.mongodb.net/?retryWrites=true&w=majority";
app.use(cors());
app.use(express.json());

mongoose.connect(URL)
.then(() =>{
    console.log("Mongo DB Connected")
})
.catch((error) =>{
    console.error({message: error.message})
})

app.get("/api/teams", async(req,res) =>{
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
        console.error(error)
    }
});


app.get("/api", async(req,res) =>{
    try {
        res.status(200).json("Welcome to F1 API");

    } catch (error) {
        console.error(error)
    }
});


app.get("/api/drivers", async(req,res) =>{
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
        console.error(error)
    }
});


app.get("/api/races", async(req,res) =>{
    try {
        const dates = [];
        const response = await fetch(
            "https://www.formula1.com/en/racing/2023.html"
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

        res.status(200).json(dates);

    } catch (error) {
        console.error(error)
    }
})




app.listen(PORT, ()=>{
    console.log(`Server running on Port ${PORT}...`)
})