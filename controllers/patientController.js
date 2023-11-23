import Patient from "../models/patientModel.js";

const registerPatient = async (req, res) => {
  const faculty = req.user._id;
  const obj = req.body.obj;
  console.log(obj);

  if (!obj.campId) {
    return res.status(400).json({
      code: 400,
      message: "Bad request",
    });
  }

  obj.faculty = faculty;
  obj.patientId = (await Patient.countDocuments()) + 1;

  const patient = await Patient.create(obj);

  if (patient) {
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } else {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error creating patient",
    });
  }
};

const updatePatient = async (req, res) => {
  if (!req.body.obj || !req.body.id) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  const patient = await Patient.findOneAndUpdate(
    { _id: req.body.id },
    req.body.obj
  );

  if (patient) {
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } else {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error creating patient",
    });
  }
};

const getAllPatient = async (req, res) => {
  const patient = await Patient.find();

  if (!patient) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "Error getting patient",
    });
  }

  res.status(200).json({
    code: 200,
    success: true,
    message: "patient get successfully",
    data: patient,
  });
};

const getPatientByUser = async (req, res) => {
  const user = req.user.id;

  const patient = await Patient.find({ faculty: user });

  if (!patient) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error getting patient",
    });
  }

  return res.status(200).json({
    code: 200,
    success: true,
    message: "patient get successful",
    data: patient,
  });
};

/////////////////My code///////////

const allocatePatient = async (req, res) => {
  if (!req.body.unallocatedPatients) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }
  const unAllocatedPatients = req.body.unallocatedPatients;
  const faculty = req.body.faculty;
  const allocated = "yes";

  var filter = {
    _id: {
      $in: unAllocatedPatients,
    },
  };

  var update = {
    $set: {
      faculty,
      allocated: "yes",
    },
  };

  var patient = await Patient.updateMany(filter, update);

  if (!patient) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error updating patients",
    });
  }

  // filter = {
  //   allocated: {
  //     $in: unAllocatedPatients,
  //   },
  // };

  // update = {
  //   $set: {
  //     allocated: "yes,",
  //   },
  // };

  // patient = await Patient.updateMany(filter, update);
  // console.log("Patietn from patientController ", patient);

  if (!patient) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error updating patients",
    });
  }

  return res.status(200).json({
    code: 200,
    success: true,
    message: "patient Allocated successful",
    data: unAllocatedPatients,
  });
};

const getUnallocatedPatients = async (req, res) => {
  const patient = await Patient.find({ allocated: "no" });

  if (!patient) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error getting patient",
    });
  }

  return res.status(200).json({
    code: 200,
    success: true,
    message: "patient get successful",
    data: patient,
  });
};

////////////////End/////////////////

const predictSoberPeriod = async (req, res) => {};

export {
  registerPatient,
  getAllPatient,
  getPatientByUser,
  updatePatient,
  allocatePatient,
  getUnallocatedPatients,
};
