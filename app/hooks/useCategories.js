import { useEffect, useState } from "react";
import useApi from "./useApi";

import categoriesApi from "../api/categories";

export default useCategories = () => {
  const [categories, setCategories] = useState();
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const getCategoriesApi = useApi(categoriesApi.getCategories);

  const getCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await getCategoriesApi.request();
      if (response.ok) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Error getting categories: ", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return [categories, categoriesLoading];
};
