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
    // Mock Sober Period prediction logic
    console.log("Sober Period Prediction Data:", data);

    // Simple mock prediction based on available factors
    let soberScore = 0;

    // Skip prediction if required fields are not selected (value = -1)
    if (data["Marital Status"] === -1 || data["Motivation factor"] === -1 ||
        data["Willingness for treatment"] === -1 || data["Risk Level"] === -1) {
      return res.status(400).json({ error: "Please select all required options before submitting" });
    }

    // Age factor (younger people might have different recovery patterns)
    if (data.Age < 30) soberScore += 1;
    if (data.Age > 50) soberScore += 1;

    // Duration of use (longer use might suggest more difficulty)
    if (data["duration of use of alcohol"] > 15) soberScore += 2;
    else if (data["duration of use of alcohol"] > 10) soberScore += 1;

    // Excessive use duration
    if (data["duration of excessive use of alcohol"] > 10) soberScore += 2;
    else if (data["duration of excessive use of alcohol"] > 5) soberScore += 1;

    // AWS Stage (higher stages might indicate more severe dependence)
    if (data.AWS_Stages >= 3) soberScore += 1;

    // Psychiatric complications
    if (data.Psy_Hallucinations === 1) soberScore += 1;
    if (data.Psy_Confusion === 1) soberScore += 1;
    if (data["Psy_Aggressive Outbursts"] === 1) soberScore += 1;

    // Family history
    if (data["How many first degree relatives had Substance addiction"] > 0) soberScore += 1;

    // Stress factors (might affect recovery)
    if (data["S_Family or relationship issues"] === 1) soberScore += 0.5;
    if (data["S_Financial Stress"] === 1) soberScore += 0.5;
    if (data["S_Work related stress"] === 1) soberScore += 0.5;

    // Support factors (living with family might help recovery)
    if (data["Living arrangement_Family"] === 1) soberScore -= 0.5;

    // Employment stability
    if (data["Did you have any period of unemployment"] === 1) soberScore += 0.5;

    // Determine sober period category based on score
    let prediction;
    if (soberScore >= 8) {
      prediction = 4; // 365-3650 days (1-10 years)
    } else if (soberScore >= 6) {
      prediction = 1; // 180-270 days (6-9 months)
    } else if (soberScore >= 4) {
      prediction = 5; // 90-180 days (3-6 months)
    } else if (soberScore >= 2) {
      prediction = 3; // 30-90 days (1-3 months)
    } else {
      prediction = 0; // 1-30 days (very short period)
    }

    console.log("Mock Sober Period Score:", soberScore, "Period:", soberPeriodMap[prediction]);

    res.status(200).json({ result: soberPeriodMap[prediction] });
  } catch (error) {
    console.error("Error in sober period prediction:", error);
    res.status(500).json({ error: "Sober Period Prediction service unavailable" });
  }
}

async function aaiPrediction(req, res, next) {
  // Get the data from the request body
  const data = req.body;

  try {
    // Mock AAI (Age at Alcohol Initiation) prediction logic
    console.log("AAI Prediction Data:", data);

    // Simple mock prediction based on available factors
    let aaiScore = 0;

    // Family history influence
    if (data["Family history of alcoholism / drug abuse, if any (who and which type of drug)"] === 1) {
      aaiScore += 1; // Family history might lead to earlier initiation
    }

    // ACE factors that might influence early alcohol use
    if (data["ACE_Early parental loss"] === 1) aaiScore += 1;
    if (data["ACE_Broken home or single parenting"] === 1) aaiScore += 1;
    if (data["ACE_Poverty or severe debts"] === 1) aaiScore += 1;
    if (data["ACE_Running away from home"] === 1) aaiScore += 1;

    // Stress factors
    if (data["S_Family or relationship issues"] === 1) aaiScore += 0.5;
    if (data["S_Financial Stress"] === 1) aaiScore += 0.5;

    // Legal complications might indicate earlier problematic use
    if (data["Legal complications yes/no"] === 1) aaiScore += 1;

    // Current age and working age correlation
    if (data.Age && data["At what age did you start working?"]) {
      const workingAge = data["At what age did you start working?"];
      if (workingAge < 18) aaiScore += 1; // Early work might correlate with early alcohol use
    }

    // Determine AAI category based on score
    let prediction;
    if (aaiScore >= 5) {
      prediction = 0; // <18 (very early initiation)
    } else if (aaiScore >= 3.5) {
      prediction = 1; // 18-25
    } else if (aaiScore >= 2.5) {
      prediction = 2; // 26-32
    } else if (aaiScore >= 1.5) {
      prediction = 3; // 33-39
    } else if (aaiScore >= 0.5) {
      prediction = 4; // 40-46
    } else {
      prediction = 5; // 47-53 (later initiation)
    }

    console.log("Mock AAI Score:", aaiScore, "Category:", aaiPredictionMap[prediction]);

    res.status(200).json({ result: aaiPredictionMap[prediction] });
  } catch (error) {
    console.error("Error in AAI prediction:", error);
    res.status(500).json({ error: "AAI Prediction service unavailable" });
  }
}

async function riskPrediction(req, res, next) {
  // Get the data from the request body
  const data = req.body;

  try {
    // Mock prediction logic - you can replace this with actual ML model logic
    console.log("Risk Prediction Data:", data);

    // Simple mock prediction based on some risk factors
    let riskScore = 0;

    // Age factor (older age might indicate higher risk)
    if (data.Age > 40) riskScore += 1;
    if (data.Age > 50) riskScore += 1;

    // Duration of alcohol use
    if (data["duration of use of alcohol"] > 10) riskScore += 1;
    if (data["duration of excessive use of alcohol"] > 5) riskScore += 1;

    // Family history
    if (data["How many first degree relatives had Substance addiction"] > 0) riskScore += 1;

    // Legal complications
    if (data["Legal complications yes/no"] === 1) riskScore += 1;

    // Psychiatric complications
    if (data.Psy_Hallucinations === 1) riskScore += 1;
    if (data.Psy_Confusion === 1) riskScore += 1;

    // Stress factors
    if (data["S_Family or relationship issues"] === 1) riskScore += 0.5;
    if (data["S_Financial Stress"] === 1) riskScore += 0.5;
    if (data["S_Work related stress"] === 1) riskScore += 0.5;

    // AWS Stage
    if (data.AWS_Stages >= 3) riskScore += 1;

    // Determine risk level based on score
    let prediction;
    if (riskScore >= 4) {
      prediction = 4; // Very High Risk
    } else if (riskScore >= 2.5) {
      prediction = 3; // High Risk
    } else {
      prediction = 3; // Default to High Risk for now
    }

    console.log("Mock Predicted Risk Score:", riskScore, "Level:", riskLevelMap[prediction]);

    res.status(200).json({ result: riskLevelMap[prediction] });
  } catch (error) {
    console.error("Error in risk prediction:", error);
    res.status(500).json({ error: "Prediction service unavailable" });
  }
}

export { soberPeriodPrediction, aaiPrediction, riskPrediction };
