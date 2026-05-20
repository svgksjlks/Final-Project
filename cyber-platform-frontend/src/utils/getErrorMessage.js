const getErrorMessage = (error) => {
  if (error?.response?.data?.errors?.length > 0) {
    return error.response.data.errors[0].message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'حدث خطأ غير متوقع';
};

export default getErrorMessage;