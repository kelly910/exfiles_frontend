import { showToast } from '../shared/toast/ShowToast';

interface ErrorMessage {
  [key: string]: string[] | undefined;
}

export interface ErrorResponse {
  messages?: ErrorMessage[];
}

const handleError = (errorResponse: ErrorResponse): void => {
  try {
    const messages = errorResponse?.messages;
    let message = 'Something went wrong. Please try again.';

    if (messages && Array.isArray(messages)) {
      const firstMessageObj = messages[0];
      let foundMessage = false;

      for (const key in firstMessageObj) {
        const value = firstMessageObj[key];
        if (Array.isArray(value) && value.length > 0) {
          message = value[0];
          foundMessage = true;
          break;
        }
      }

      if (!foundMessage) {
        messages.forEach((msg) => {
          if (msg.contact_number?.length) {
            message = msg.contact_number[0];
          } else if (msg.non_field_errors?.length) {
            message = msg.non_field_errors[0];
          } else if (msg.detail?.length) {
            message = msg.detail[0];
          } else if (msg.start_date?.length) {
            message = msg.start_date[0];
          } else if (msg.messages?.length) {
            const nestedMsg = msg.messages[0] as unknown as ErrorMessage;
            if (nestedMsg?.message?.length) {
              message = nestedMsg.message[0];
            }
          } else if (msg.orders?.length) {
            message = msg.orders[0];
          }
        });
      }
    }
    showToast('error', message);
  } catch (error) {
    console.log(error, 'error');
    showToast('error', 'An unexpected error occurred.');
  }
};

export { handleError };
