import { getErrorMessage } from '../utils';

describe('getErrorMessage', () => {
  it('should return the correct message for status 400', () => {
    const message = getErrorMessage(400);
    expect(message).toBe("An error occurred while fetching search results. Please refine your search query.");
  });

  it('should return the correct message for status 404', () => {
    const message = getErrorMessage(404);
    expect(message).toBe("The requested resource was not found. Please try a different query.");
  });

  it('should return the correct message for status 500', () => {
    const message = getErrorMessage(500);
    expect(message).toBe("An internal server error occurred. Please try again later.");
  });

  it('should return the default message for an unknown status', () => {
    const message = getErrorMessage(999);
    expect(message).toBe("An unexpected error occurred. Please try again.");
  });
});
