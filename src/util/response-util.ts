export const createResponse = (
  statusCode: number,
  message: string,
  data?: any,
) => {
  const response: any = {
    statusCode,
    message,
  };
  if (data) response.data = data;

  return response;
};
