import Show from "../models/show.js";

const checkSeatAvailability = async(showId, selectedSeat) => {
    try {
        const showData = await Show.findById(showId);
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeat.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
        
    } catch (error) {
        console.log('checkAvailabilitySeat error',error.message);
        return false;
        
    }
}