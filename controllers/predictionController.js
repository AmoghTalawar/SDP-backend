import axios from "axios";

const soberPeriodMap = {
  0: "1-30",
  1: "180-270",
  2: "270-365",
  3: "30-90",
  4: "365-3650",
  5: "90-180",
};

const riskLevelMap = {
  4: "Very High Risk",
  3: "High-Risk",
};

const aaiPredictionMap = {
  0: "<18",
  1: "18-25",
  2: "26-32",
  3: "33-39",
  4: "40-46",
  5: "47-53",
  6: "54-60",
  7: ">60",
};

async function soberPeriodPrediction(req, res, next) {
  // Get the data from the request body
  const data = req.body;

  try {
    const response = await axios.post(
      "http://127.0.0.1:9000/soberPrediction",
      data
    );

    console.log("Predicted Value:", soberPeriodMap[response.data.prediction]);
    // return response.data.prediction;
    res.status(200).json({ result: soberPeriodMap[response.data.prediction] });
  } catch (error) {
    console.error("Error fetching prediction:", error);
  }
}

async function aaiPrediction(req, res, next) {
  // Get the data from the request body
  const data = req.body;

  try {
    const response = await axios.post(
      "http://127.0.0.1:9000/aaoPrediction",
      data
    );

    console.log("Predicted Value:", response.data.prediction);
    // return response.data.prediction;
    var aux = parseInt(response.data.prediction);
    console.log("MAP : ");
    res.status(200).json({ result: aaiPredictionMap[aux] });
  } catch (error) {
    console.error("Error fetching prediction:", error);
  }
}

async function riskPrediction(req, res, next) {
  // Get the data from the request body
  const data = req.body;

  try {
    const response = await axios.post(
      "http://127.0.0.1:9000/riskPrediction",
      data
    );

    console.log("Predicted Value:", response.data.prediction);
    // return response.data.prediction;
    var aux = parseInt(response.data.prediction);
    res.status(200).json({ result: riskLevelMap[aux] });
  } catch (error) {
    console.error("Error fetching prediction:", error);
  }
}

export { soberPeriodPrediction, aaiPrediction, riskPrediction };
