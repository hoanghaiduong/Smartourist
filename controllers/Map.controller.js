import axios from "axios"

//TRẢ về lat long của 1 địa chỉ
const findLocation = async (req, res) => {
    const { address, apiKey } = req.query;
    if (!address && !apiKey) {
        res.status(404).send({
            address: "Address is required",
            apiKey: "Api Key is required"
        });
    }
    try {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`).then((response) => {
            res.status(200).json({
                data: response
            });
        })
    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message
        });
    }
}
//Tìm địa chỉ cụ thể với văn bản
const findPlaceWithTextQuery = async (req, res) => {
    const { inputPlace, apiKey } = req.query;
    if (!inputPlace || !apiKey) {
        res.status(400).send({
            inputPlace: "Input place is required",
            apiKey: "Please enter API key here"
        })
    }
    try {
        axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${inputPlace}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cicon%2Cphotos%2Cplace_id&key=${apiKey}`).then((response) => {
            res.status(200).send({
                data: response
            })
        });
    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message
        });
    }

}
// Tìm hình ảnh của địa điểm
const findImagesRefWithPlace = async (req, res) => {
    const { photoRef, apiKey } = req.query;
    if (!photoRef || !apiKey) {
        res.status(404).send({
            photoRef: "Photo is required",
            apiKey: "Photo is required"
        })
    }
    try {
        axios.get(`https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&maxwidth=600&key=${apiKey}`).then((response) => {
            res.status(200).send({
                data: response
            })
        });
    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message
        });
    }
}
//Tìm kiếm địa chỉ có liên quan bằng văn bản
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=Khu du lịch&key=AIzaSyAet8Mk1nPvOn_AebLE5ZxXoGejOD8tPzA
const findRefPlacesWithText = async (req, res) => {
    const { place, apiKey } = req.query;
    if (!place || !apiKey) {
        res.status(404).send({
            place: "Please enter a valid name place",
            apiKey: "API key required"
        })
    }
    try {
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=${apiKey}`).then((response) => {
            res.status(200).send({
                data: response
            })
        });
    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message
        });
    }
}

const findPlaceWithAutoComplete= async (req, res) => {
    const { place, apiKey } = req.query;
    if (!place || !apiKey) {
        res.status(404).send({
            place: "Please enter a valid name place",
            apiKey: "API key required"
        })
    }
    try {
        axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${place}&language=vi_VN&types=geocode&key=${apiKey}`).then((response) => {
            res.status(200).send({
                data: response
            })
        });
    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message
        });
    }
}
const findPlaceWithAutoCompletePro= async (req, res) => {
    const { place, apiKey } = req.query;
    if (!place || !apiKey) {
        res.status(404).send({
            place: "Please enter a valid name place",
            apiKey: "API key required"
        })
    }
    try {
        axios.get(`https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${place}&language=vi_VN&key=${apiKey}`).then((response) => {
            res.status(200).send({
                data: response
            })
        });
    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message
        });
    }
}
//https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=Khu du lịch bửu&language=vi_VN&key=AIzaSyAet8Mk1nPvOn_AebLE5ZxXoGejOD8tPzA
export {
    findLocation,findPlaceWithTextQuery,findImagesRefWithPlace,findRefPlacesWithText,findPlaceWithAutoComplete,findPlaceWithAutoCompletePro
}