import { ERROR_MESSAGES } from '../errorMessages';
import { getErrorMessage } from '../utils';

describe('getErrorMessage', () => {
  it('should return the correct message for status 400', () => {
    const message = getErrorMessage(400);
    expect(message).toBe(ERROR_MESSAGES.BAD_REQUEST);
  });

  it('should return the correct message for status 404', () => {
    const message = getErrorMessage(404);
    expect(message).toBe(ERROR_MESSAGES.NOT_FOUND);
  });

  it('should return the correct message for status 500', () => {
    const message = getErrorMessage(500);
    expect(message).toBe(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  });

  it('should return the default message for an unknown status', () => {
    const message = getErrorMessage(999);
    expect(message).toBe(ERROR_MESSAGES.UNEXPECTED_ERROR);
  });
});
