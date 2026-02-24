import axios from "axios";

export const api = axios.create({
  baseURL: "https://be.ericsebb.qzz.io/", 
  headers: {
    "Content-Type": "application/json",
  },
});

