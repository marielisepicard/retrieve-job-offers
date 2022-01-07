const axios = require("axios");

const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  const company = req.url.split("/getOpenJobsInfos/")[1],
    option = {
      "Content-type": "text/html; charset=utf8",
    };

  if (company) {
    axios
      .get(`https://api.lever.co/v0/postings/${company}?mode=json`)
      .then((result) => {
        let openJobs = result.data.map((job) => {
          return {
            lever_id: job.id,
            name: job.text,
            department: job.categories.department,
            jobUrl: job.hostedUrl,
            contract: job.categories.commitment + " contract",
            team: job.categories.team,
            location: job.categories.location,
            publishedAt: job.createdAt,
          };
        });
        let data = {
          companyName: company,
          endpointLever: `https://api.lever.co/v0/postings/${company}?mode=json`,
          nbrOpenJob: result.data.length,
          openJobs: openJobs,
        };
        res
          .writeHead(200, { "Content-Type": "application/json" })
          .end(JSON.stringify(data));
      })
      .catch((error) => res.writeHead(404, option).end("No result found"));
  } else {
    res
      .writeHead(200, option)
      .end(
        "Company parameter is missing or incorrectly written. Use the following URL: getOpenJobsInfos/<Company Name>"
      );
  }
});

server.listen(process.env.PORT || 3000);
