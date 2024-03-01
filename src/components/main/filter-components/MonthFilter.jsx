import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const MonthFilter = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (selectedMonth) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("date", format(new Date(selectedMonth), "yyyy-MM-dd"));
      navigate(`?${searchParams.toString()}`);
    }else{
        navigate("");
    }
  }, [selectedMonth]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <DatePicker
        showMonthYearPicker
        isClearable
        placeholderText="Select Month"
        dateFormat={"MM-yyyy"}
        className="customDatePicker"
        selected={selectedMonth}
        onChange={(date) => setSelectedMonth(date)}
      />
    </Box>
  );
};

export default MonthFilter;
