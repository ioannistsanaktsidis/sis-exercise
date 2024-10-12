import { ERROR_MESSAGES } from "../constants/constants";
import { SearchResult } from "../types";

export const getErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.BAD_REQUEST;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNEXPECTED_ERROR;
  }
};

export const mapApiResponseToSearchResult = (results: any): SearchResult[] => {
  return results.map((item: any) => ({
    title: item.title,
    abstract: item.abstract,
    publicationDate: item.publication_date
  }));
};
