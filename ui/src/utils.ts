export const getErrorMessage = (status: number): string => {
    switch (status) {
      case 400:
        return "An error occurred while fetching search results. Please refine your search query.";
      case 404:
        return "The requested resource was not found. Please try a different query.";
      case 500:
        return "An internal server error occurred. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };
