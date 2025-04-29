import { Event } from "@/types/Event"; 
import axios from "axios";
import React from "react";


const useGetCategoryWithBlog = async () => {
  const { data } = await axios.get<[Event]>(
    "http://localhost:3000/api/events"
  );
  return data as Event[];
};

export default useGetCategoryWithBlog;
