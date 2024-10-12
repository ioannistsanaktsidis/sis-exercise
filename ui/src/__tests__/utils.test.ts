import { ERROR_MESSAGES } from "../constants/constants";
import { SearchResult } from "../types";
import { getErrorMessage, mapApiResponseToSearchResult } from "../utils/utils";

describe("getErrorMessage", () => {
  it("should return the correct message for status 400", () => {
    const message = getErrorMessage(400);
    expect(message).toBe(ERROR_MESSAGES.BAD_REQUEST);
  });

  it("should return the correct message for status 404", () => {
    const message = getErrorMessage(404);
    expect(message).toBe(ERROR_MESSAGES.NOT_FOUND);
  });

  it("should return the correct message for status 500", () => {
    const message = getErrorMessage(500);
    expect(message).toBe(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  });

  it("should return the default message for an unknown status", () => {
    const message = getErrorMessage(999);
    expect(message).toBe(ERROR_MESSAGES.UNEXPECTED_ERROR);
  });
});

describe("mapApiResponseToSearchResult", () => {
  it("should map publication_date to publicationDate", () => {
    const results = [
      {
        title: "Test Title 1",
        abstract: "Test Abstract 1",
        publication_date: "2024-01-01"
      },
      {
        title: "Test Title 2",
        abstract: "Test Abstract 2",
        publication_date: "2024-02-01"
      }
    ];

    const expectedResults: SearchResult[] = [
      {
        title: "Test Title 1",
        abstract: "Test Abstract 1",
        publicationDate: "2024-01-01"
      },
      {
        title: "Test Title 2",
        abstract: "Test Abstract 2",
        publicationDate: "2024-02-01"
      }
    ];

    const mappedResults = mapApiResponseToSearchResult(results);

    expect(mappedResults).toEqual(expectedResults);
  });
});
