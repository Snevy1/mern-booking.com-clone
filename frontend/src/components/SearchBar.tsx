import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/searchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const search = useSearchContext();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childrenCount, setchildrenCount] = useState<number>(search.childrenCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(destination, checkIn, checkOut, adultCount, childrenCount);
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-[#1E293B] rounded-xl shadow-2xl grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-3"
    >
      {/* Destination */}
      <div className="flex flex-row items-center flex-1 bg-white p-3 rounded-lg shadow-inner group">
        <MdTravelExplore size={24} className="mr-2 text-slate-400 group-focus-within:text-[#74B9CB] transition-colors" />
        <input
          type="text"
          placeholder="Where are you going?"
          className="text-md w-full focus:outline-none font-medium text-slate-700"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      {/* Guests */}
      <div className="flex bg-white px-3 py-2 gap-2 rounded-lg shadow-inner">
        <label className="items-center flex text-xs font-bold text-slate-500 uppercase tracking-wider">
          Adults
          <input
            className="w-full p-1 focus:outline-none font-bold text-lg text-slate-800"
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => setAdultCount(parseInt(event.target.value))}
          />
        </label>
        <div className="border-l border-slate-200 mx-2"></div>
        <label className="items-center flex text-xs font-bold text-slate-500 uppercase tracking-wider">
          Children
          <input
            className="w-full p-1 focus:outline-none font-bold text-lg text-slate-800"
            type="number"
            min={0}
            max={20}
            value={childrenCount}
            onChange={(event) => setchildrenCount(parseInt(event.target.value))}
          />
        </label>
      </div>

      {/* Date Pickers */}
      <div className="bg-white rounded-lg shadow-inner">
        <DatePicker
          selected={checkIn}
          onChange={(date: any) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
           maxDate={maxDate}
          placeholderText="Check-in"
          className="w-full bg-transparent p-3 focus:outline-none font-medium text-slate-700 cursor-pointer"
          wrapperClassName="w-full"
          calendarClassName="custom-datepicker"
        />
      </div>

      <div className="bg-white rounded-lg shadow-inner">
        <DatePicker
          selected={checkOut}
          onChange={(date: any) => setCheckOut(date as Date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || minDate}
           maxDate={maxDate}
          placeholderText="Check-out"
          className="w-full bg-transparent p-3 focus:outline-none font-medium text-slate-700 cursor-pointer"
          wrapperClassName="w-full"
          calendarClassName="custom-datepicker"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 h-full">
        <button
          type="submit"
          className="flex-grow bg-[#F59E0B] text-white font-bold text-lg rounded-lg hover:bg-[#D97706] transition-all transform active:scale-95 shadow-lg"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setDestination("")}
          className="px-4 bg-slate-700 text-slate-300 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;