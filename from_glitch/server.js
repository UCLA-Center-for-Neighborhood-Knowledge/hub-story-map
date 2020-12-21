// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get('/policy-data', function(req, res) {

  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appyQ2JBKuGdwasKX');
  
  let federal = [];
  var each_fed;
  
  let states = [];
  var each_state;

  base('States_Policy_w_FIPS_JEYON').select({
    view: 'Grid view'
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
      each_state = {
        GEOID: record.get('GEOID'),
        STUSPS: record.get('STUSPS'),
        NAME: record.get('NAME'),
        EMPLOYMENT_PROTECTIONS: record.get('CHR_Employment_protections'),
        EMPLOYMENT_TYPE: record.get('CHR_Employment_protection_type'),
        EMPLOYMENT_SUMMARY: record.get('CHR_Employment_protection_summary'),
        EMPLOYMENT_CODE: record.get('CHR_Employment_statute_policy_code'),
        EMPLOYMENT_CATEGORIES: record.get('CHR_Employment_protected_categories'),
        EMPLOYMENT_URL: record.get('CHR_Employment_info_link'),
        HOUSING_PROTECTIONS: record.get('CHR_Housing_protections'),
        HOUSING_TYPE: record.get('CHR_Housing_protection_type'),
        HOUSING_SUMMARY: record.get('CHR_Housing_protection_summary'),
        HOUSING_CODE: record.get('CHR_Housing_statute_policy_code'),
        HOUSING_CATEGORIES: record.get('CHR_Housing_protected_categories'),
        HOUSING_URL: record.get('CHR_Housing_info_link'),  
        ACCOMMODATIONS_PROTECTIONS: record.get('CHR_PublicAcc_protections'),
        ACCOMMODATIONS_TYPE: record.get('CHR_PublicAcc_protection_type'),
        ACCOMMODATIONS_SUMMARY: record.get('CHR_PublicAcc_protection_summary'),
        ACCOMMODATIONS_CODE: record.get('CHR_PublicAcc_statute_policy_code'),
        ACCOMMODATIONS_CATEGORIES: record.get('CHR_PublicAcc_protected_categories'),
        ACCOMMODATIONS_URL: record.get('CHR_PublicAcc_info_link'),
        /*HC_PROTECTIONS: record.get('HC_Offense_protections'),
        HC_TYPE: record.get('HC_Offense_protection_type'),
        HC_SUMMARY: record.get('HC_Offense_protection_summary'),
        HC_CODE: record.get('HC_Offense_statute_policy_code'),
        HC_CATEGORIES: record.get('HC_Offense_protected_categories'),
        HC_URL: record.get('HC_Offense_info_link'),*/
        HCPENALTY_PROTECTIONS: record.get('HC_Penalty_protections'),
        HCPENALTY_TYPE: record.get('HC_Penalty_protection_type'),
        HCPENALTY_SUMMARY: record.get('HC_Penalty_protection_summary'),
        HCPENALTY_CODE: record.get('HC_Penalty_statute_policy_code'),
        HCPENALTY_CATEGORIES: record.get('HC_Penalty_protected_categories'),
        HCPENALTY_URL: record.get('HC_Penalty_info_link'),
        /*HCBOTH_PROTECTIONS: record.get('HC_Both_protections'),
        HCBOTH_TYPE: record.get('HC_Both_protection_type'),
        HCBOTH_SUMMARY: record.get('HC_Both_protection_summary'),
        HCBOTH_CODE: record.get('HC_Both_statute_policy_code'),
        HCBOTH_CATEGORIES: record.get('HC_Both_protected_categories'),
        HCBOTH_URL: record.get('HC_Both_info_link'),*/
        CR_PROTECTIONS: record.get('CR_Commission_protection'),
        CR_COMMISSION: record.get('CR_Commission'),
        CR_URL: record.get('CR_info_link'),
        id: record.id
      }
      states.push(each_state);
    });

    fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
        console.log("got this far!");
        // res.json(states); // prints at the endpoint
    
        let fs = require('fs');
        let cachestates = JSON.stringify(states);
        console.log("writing the whole states array");
        console.log(cachestates);
        fs.writeFileSync('public/state-policy-data.json', cachestates, function(err) {
          console.log('state policy data cached');
        });

    });
  
  base('Federal_Policy').select({
    view: 'Grid view'
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
      each_fed = {
        JURISDICTION: record.get('jurisdiction'),
        FED_HOUSING_STATUTE: record.get('housing_statute'),
        FED_HOUSING_URL: record.get('housing_link'),
        FED_HOUSING_NICKNAME: record.get('housing_nickname'),
        FED_HOUSING_SUMMARY: record.get('housing_protection_summary'),
        FED_EMPLOYMENT_STATUTE: record.get('employment_statute'),
        FED_EMPLOYMENT_URL: record.get('employment_link'),
        FED_EMPLOYMENT_NICKNAME: record.get('employment_nickname'),
        FED_EMPLOYMENT_SUMMARY: record.get('employment_protection_summary'),
        FED_ACCOMMODATIONS_STATUTE: record.get('public_acc_statute'),
        FED_ACCOMMODATIONS_URL: record.get('public_acc_link'),
        FED_ACCOMMODATIONS_NICKNAME: record.get('public_acc_nickname'),
        FED_ACCOMMODATIONS_SUMMARY: record.get('public_acc_protection_summary'),
        FED_VOTING_STATUTE: record.get('voting_statute'),
        FED_VOTING_URL: record.get('voting_link'),
        FED_VOTING_SUMMARY: record.get('voting_protection_summary'),
        FED_COLOR_STATUTE: record.get('color_statute'),
        FED_COLOR_URL: record.get('color_link'),
        FED_COLOR_SUMMARY: record.get('color_protection_summary'),
        FED_EQUAL_STATUTE: record.get('equal_statute'),
        FED_EQUAL_URL: record.get('equal_link'),
        FED_EQUAL_SUMMARY: record.get('equal_protection_summary'),
        FED_HATE_STATUTE: record.get('hate_statute'),
        FED_HATE_URL: record.get('hate_link'),
        FED_HATE_SUMMARY: record.get('hate_summary'),
        id: record.id
      }
      federal.push(each_fed);
    });

    fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
        console.log("got this far!");
        res.json("federal and states policy written"); // prints at the endpoint
    
        let fs = require('fs');
        let cachefeds = JSON.stringify(federal);
        console.log("writing the whole federal array");
        console.log(cachefeds);
        fs.writeFileSync('public/federal-policy-data.json', cachefeds, function(err) {
          console.log('federal policy data cached');
        });

    });

});

app.get("/story-data", (request, response) => {
  var Airtable = require("airtable");
  var parallel = require("run-parallel");
  var Hubfs = require("hubfs.js");
  var geojsonhint = require("@mapbox/geojsonhint");
  var deepEqual = require("deep-equal");
  var rewind = require("geojson-rewind");
  var debug = require("debug")("airtable-github-export");
  var stringify = require("json-stable-stringify");

  let responsetext = "airtable to geojson update check complete";

  require("dotenv").config();

  var config = {
    tables: process.env.TABLES.split(","),
    githubToken: process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO,
    owner: process.env.GITHUB_OWNER,
    airtableToken: process.env.AIRTABLE_API_KEY,
    base: process.env.AIRTABLE_BASE_ID,
    branches: process.env.GITHUB_BRANCH
      ? process.env.GITHUB_BRANCH.split(",")
      : ["master"],
    filename: process.env.GITHUB_FILENAME || "data.json"
  };

  var CREATE_MESSAGE = "[AIRTABLE-GITHUB-EXPORT] create " + config.filename;
  var UPDATE_MESSAGE = "[AIRTABLE-GITHUB-EXPORT] update " + config.filename;

  var hubfsOptions = {
    owner: config.owner,
    repo: config.repo,
    auth: {
      token: config.githubToken
    }
  };

  var gh = Hubfs(hubfsOptions);

  var base = new Airtable({ apiKey: config.airtableToken }).base(config.base);

  var output = {};

  var tasks = config.tables.map(function(tableName) {
    return function(cb) {
      var data = [];
      // Ensure properties of output are set in the same order
      // otherwise they are set async and may change order, which
      // results in unhelpful diffs in Github
      output[tableName] = null;

      base(tableName)
        .select()
        .eachPage(page, done);

      function page(records, next) {
        // This function will get called for each page of records.
        records.forEach(function(record) {
          var feature = {
            type: "Feature",
            id: record._rawJson.id,
            properties: record._rawJson.fields || {}
          };
          var geometry = parseGeometry(get(record, "geometry"));
          var coords = parseCoords([get(record, "Longitude"), get(record, "Latitude")]);
          if (geometry) {
            feature.geometry = geometry;
            delete feature.properties.geometry;
            delete feature.properties.Geometry;
          } else if (coords) {
            feature.geometry = {
              type: "Point",
              coordinates: coords
            };
          } else {
            feature.geometry = null;
          }
          let approval = get(record, "Approved for Website");
          if (approval === true) {
            data.push(feature);
          }
        });
        next();
      }

      function done(err) {
        if (err) return cb(err);
        var featureCollection = {
          type: "FeatureCollection",
          features: data
        };
        output[tableName] = featureCollection;
        cb();
      }
    };
  });

  parallel(tasks, function(err, result) {
    if (err) return onError(err);
    gh.readFile(config.filename, { ref: config.branches[0] }, function(
      err,
      data
    ) {
      console.log("starting reading github");
      if (err) {
        if (!(/not found/i.test(err) || err.notFound)) {
          return onError(err);
        }
      } else {
        data = JSON.parse(data);
        console.log("parsing data");
      }
      /*if (data && deepEqual(data, output)) {
        return debug("No changes from Airtable, skipping update to Github");
        console.log("No changes from Airtable, skipping update to Github");
      }*/
      var message = data ? UPDATE_MESSAGE : CREATE_MESSAGE;
      ghWrite(config.filename, output, config.branches, message, function(err) {
        if (err) return onError(err);
        debug(
          "Updated " +
            config.owner +
            "/" +
            config.repo +
            "/" +
            config.filename +
            " with latest changes from Airtable"
        );
        console.log(
          "Updated " +
            config.owner +
            "/" +
            config.repo +
            "/" +
            config.filename +
            " with latest changes from Airtable"
        );
      });
    });
  });

  function ghWrite(filename, data, branches, message, cb) {
    var pending = branches.length;
    branches.forEach(function(branch) {
      var opts = {
        message: message,
        branch: branch
      };
      gh.writeFile(
        filename,
        stringify(data, { replacer: null, space: 2 }),
        opts,
        done
      );
    });
    function done(err) {
      if (err) return cb(err);
      if (--pending > 0) return;
      cb();
    }
    response.status(200).json({
      message: responsetext
    });
  }

  function onError(err) {
    console.error(err);
    process.exit(1);
  }

  // Case insensitive record.get
  function get(record, fieldName) {
    if (typeof record.get(fieldName) !== "undefined") {
      return record.get(fieldName);
    } else if (
      typeof record.get(
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      ) !== "undefined"
    ) {
      return record.get(fieldName.charAt(0).toUpperCase() + fieldName.slice(1));
    } else if (typeof record.get(fieldName.toUpperCase()) !== "undefined") {
      return record.get(fieldName.toUpperCase());
    }
  }

  // Try to parse a geometry field if it is valid GeoJSON geometry
  function parseGeometry(geom) {
    if (!geom) return null;
    try {
      geom = rewind(JSON.parse(geom));
    } catch (e) {
      return null;
    }
    var errors = geojsonhint.hint(geom);
    if (errors && errors.length) return null;
    return geom;
  }

  // Check whether coordinates are valid
  function parseCoords(coords) {
    if (typeof coords[0] !== "number" || typeof coords[1] !== "number")
      return null;
    if (
      coords[0] < -180 ||
      coords[0] > 180 ||
      coords[1] < -90 ||
      coords[1] > 90
    )
      return null;
    return coords;
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
