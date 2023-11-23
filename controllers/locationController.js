import Location from "../models/locationModel.js";


const registerLocation = async (req, res) => {


    const { name, address } = req.body;

    const obj = {
        name,
        address
    }

    const loc = await Location.create(obj);

    if (!loc) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Internal server errror"
        })
    }

    return res.status(200).json({
        code: 200,
        success: true,
        message: "Location Created Successfully",
        data: loc
    })

}


const updateLocation = async (req, res) => {

    const { id } = req.params

    const { name, address } = req.body


    const obj = {
        name: name,
        address
    }

    const location = await Location.findOneAndUpdate({
            _id: id
        }, obj
    );

    if (location) {

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Location updated successfully",
            location
        })

    } else {
        return res.status(500).json({
            code: 500,
            success: false,
            message: "error updating Location"
        })
    }

}




const getLocations = async (req, res) => {

    const locations = await Location.find();

    if (!locations) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Internal server error"
        })
    }

    return res.status(200).json({
        code: 200,
        success: true,
        message: "Locations get successful",
        data: locations
    })

}

export {
    getLocations,
    registerLocation,
    updateLocation
}
