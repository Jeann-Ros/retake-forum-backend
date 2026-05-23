export const removeEmptyKeys = (OriginalValues: any) => {
  return Object.fromEntries(
    Object.entries(OriginalValues).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  );
};
