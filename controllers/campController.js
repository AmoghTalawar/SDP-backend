import Camp from "../models/campModel.js";

const registerCamp = async (req, res) => {
  const { name, locationId, faculty, startDate, endDate } = req.body;

  if (!name || !locationId || !faculty) {
    return res.status(400).json({
      code: 400,
      success: false,
      message: "Bad Request",
    });
  }

  const obj = {
    name: name,
    locationId: locationId,
    faculty: faculty,
    startDate: startDate,
    endDate: endDate,
  };

  const camp = await Camp.create(obj);

  if (camp) {
    return res.status(200).json({
      code: 200,
      success: true,
      message: "camp created successfully",
      camp,
    });
  } else {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error creating camp",
    });
  }
};

const updateCamp = async (req, res) => {
  const { id } = req.params;

  const { name, locationId, faculty, startDate, endDate } = req.body;

  const obj = {
    name: name,
    locationId: locationId,
    startDate: startDate,
    endDate: endDate,
    faculty,
  };

  const camp = await Camp.findOneAndUpdate(
    {
      _id: id,
    },
    obj
  );

  if (camp) {
    return res.status(200).json({
      code: 200,
      success: true,
      message: "camp created successfully",
      camp,
    });
  } else {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error creating camp",
    });
  }
};

const getAllCamp = async (req, res) => {
  const camp = await Camp.find();

  if (camp) {
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Camp get successfully",
      data: camp,
    });
  } else {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "Error getting camps",
    });
  }
};

const getCampByUser = async (req, res) => {
  const user = req.user.id;

  const camp = await Camp.find();

  console.log(camp);

  if (!camp) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "error getting camps",
    });
  }

  const campArray = [];

  for (var cp of camp) {
    for (var ct of cp.faculty) {
      // if (ct == user) {
      campArray.push(cp);
      // }
    }
  }

  return res.status(200).json({
    code: 200,
    success: true,
    message: "Camps get successful",
    data: campArray,
  });
};

export { getCampByUser, registerCamp, getAllCamp, updateCamp };
