import axios from "axios"
import { urlencoded } from "express";
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
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
        axios.get(encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`)).then((response) => {
            res.status(200).json({
                data: response.data
            });
        }).catch((err) => {
            res.status(400).json({
                data: err.message
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
        axios.get(encodeURI(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${inputPlace}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cicon%2Cphotos%2Cplace_id&key=${apiKey}`)).then((response) => {
            res.status(200).send({
                data: response.data
            })
        }).catch((err) => {
            res.status(400).json({
                data: err.message
              });
        })
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
        axios.get(encodeURI(`https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&maxwidth=600&key=${apiKey}`)).then((response) => {
            res.status(200).send({
                data: response.data
            })
        }).catch((err) => {
            res.status(400).json({
                data: err.message
              });
        })
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
        axios.get(encodeURI(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=${apiKey}`)).then((response) => {
            res.status(200).send({
                data: response.data
            })
        }).catch((err) => {
            res.status(400).json({
                data: err.message
              });
        })
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
        const uri=`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${place}&language=vi_VN&types=geocode&key=${apiKey}`;
        var url=encodeURI(uri);
        console.log(url);
        axios.get(url).then((response) => {
            res.status(200).send({
                data: response.data
            })
        }).catch((err) => {
            res.status(400).json({
                data: err.message
              });
        })
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
        const uri=`https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${place}&language=vi_VN&key=${apiKey}`;
        const url=encodeURI(uri);
        console.log(url);
        axios.get(url).then((result) => {
            res.status(200).json({
                data: result.data
              });
        }).catch((err) => {
            res.status(400).json({
                data: err.message
              });
        })
    } catch (error) {
        res.status(error.status || 400).send({
            message: error.message
        });
    }
}
//https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=Khu du lịch bửu&language=vi_VN&key=AIzaSyAet8Mk1nPvOn_AebLE5ZxXoGejOD8tPzA

//api chỉ đường
const findGetRedirection=async (req, res) =>
{
//     https://maps.googleapis.com/maps/api/directions/json
//   ?destination=place_id%3AChIJA01I-8YVhkgRGJb0fW4UX7Y
//   &origin=place_id%3AChIJ685WIFYViEgRHlHvBbiD5nE
//   &key=YOUR_API_KEY

    //mode ={ driving(lái xe (mặc định)) ,walking (Đi bộ) ,bicycling (xe đạp), transit (chuyển tuyến) }
    //avoid (tránh)={tolls (trạm thu phí),highways(đường cao tốc) ,ferries(phà)  }
    //waypoints các điểm 
    //&waypoints=via:San Francisco|via:Mountain View|...
    const { destination,origin,apiKey ,mode,avoid,waypoints} = req.query;
  
    if (!origin || !apiKey || !destination) {
        res.status(404).send({
            place: "Please enter a valid name place",
            apiKey: "API key required",
            destination: "Destination is required"
        })
    }
    try {
        axios.get(encodeURI(`https://maps.googleapis.com/maps/api/directions/json
        ?destination=${destination}
        &mode=${mode}
        &origin=${origin}
        &avoid=${avoid}
        &waypoints=via%3A${waypoints}
        &key=${apiKey}`)).then((response) => {
            res.status(200).send({
                statusCode:response.status,
                data: response.data
            })
        }).catch((err) => {
            res.status(400).json({
                data: err.message
              });
        })
    } catch (error) {
        res.status(error.status  || 400).send({
            message: error.message
        });
    }
}
export {
    findLocation,findPlaceWithTextQuery,findImagesRefWithPlace,findRefPlacesWithText,findPlaceWithAutoComplete,findPlaceWithAutoCompletePro,
    findGetRedirection
}