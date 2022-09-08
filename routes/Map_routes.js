import express from "express";
import { findImagesRefWithPlace, findLocation, findPlaceWithAutoComplete, findPlaceWithAutoCompletePro, findRefPlacesWithText } from "../controllers/Map.controller.js";
const router = express.Router();
router.get('/findLatLongLocation', findLocation);
router.get('/findAutoLocationByType',findPlaceWithAutoComplete);
router.get('/findRefPlacesWithText',findRefPlacesWithText);
router.get('/findAutoLocation', findPlaceWithAutoCompletePro);
//tìm hình ảnh của địa điểm
router.get('/findImageLocation',findImagesRefWithPlace);
export default router;