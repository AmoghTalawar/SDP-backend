import Patient from "../models/patientModel.js";
import connectDB from "../config/db.js";

const registerPatient = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();

    const faculty = req.user._id;
    const obj = req.body.obj;
    console.log(obj);
    console.log("Faculty ID:", faculty);
    console.log("Faculty type:", typeof faculty);

    // Handle fallback authentication case
    if (typeof faculty === "string" && (faculty.includes("admin-user-id") || faculty.includes("faculty-user-id") || faculty.includes("nurse-user-id"))) {
      // For fallback authentication, try to use a real faculty from database
      try {
        const User = (await import("../models/userModel.js")).default;
        const existingFaculty = await User.findOne({ role: "faculty" });

        if (existingFaculty) {
          obj.faculty = existingFaculty._id;
          console.log("Using existing faculty:", existingFaculty._id);
        } else {
          // Create a temporary faculty user for fallback
          const tempFaculty = await User.create({
            name: "System Faculty",
            email: "system@fallback.com",
            password: "temp123",
            role: "faculty"
          });
          obj.faculty = tempFaculty._id;
          console.log("Created temp faculty:", tempFaculty._id);
        }
      } catch (userError) {
        console.error("Error handling faculty:", userError.message);
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Error processing faculty information",
          error: userError.message,
        });
      }
    } else {
      obj.faculty = faculty;
    }

    // Ensure patient is created as unallocated by default
    obj.allocated = "no";
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
  } catch (error) {
    console.error("Error in registerPatient:", error.message);
    return res.status(500).json({
      code: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updatePatient = async (req, res) => {
  if (!req.body.obj || !req.body.id) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  console.log("UPDATE PATIENT : ", req.body.obj);

  const patient = await Patient.findOneAndUpdate(
    { _id: req.body.id },
    req.body.obj
  );

  console.log(patient);

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
  try {
    // Ensure database connection
    await connectDB();

    const patient = await Patient.find();

    res.status(200).json({
      code: 200,
      success: true,
      message: "patient get successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Error in getAllPatient:", error.message);
    return res.status(500).json({
      code: 500,
      success: false,
      message: "Error getting patient",
      error: error.message,
    });
  }
};

const getPatientByUser = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();

    const user = req.user._id;

    // Handle fallback authentication case
    if (typeof user === "string" && (user.includes("admin-user-id") || user.includes("faculty-user-id") || user.includes("nurse-user-id"))) {
      // For admin users, return all patients
      const patient = await Patient.find();
      return res.status(200).json({
        code: 200,
        success: true,
        message: "patient get successful",
        data: patient,
      });
    }

    const patient = await Patient.find({ faculty: user });

    return res.status(200).json({
      code: 200,
      success: true,
      message: "patient get successful",
      data: patient,
    });
  } catch (error) {
    console.error("Error in getPatientByUser:", error.message);
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error getting patient",
      error: error.message,
    });
  }
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
  try {
    // Ensure database connection
    await connectDB();

    const patient = await Patient.find({ allocated: "no" });

    return res.status(200).json({
      code: 200,
      success: true,
      message: "patient get successful",
      data: patient,
    });
  } catch (error) {
    console.error("Error in getUnallocatedPatients:", error.message);
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error getting patient",
      error: error.message,
    });
  }
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
