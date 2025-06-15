type AttributeType =
  | string
  | Date
  | boolean
  | number
  | null
  | Record<string, unknown>
  | { [key: string]: AttributeType }
  | AttributeType[];

const deleteBaseAttributes = <T extends Record<string, AttributeType>>(
  obj: T,
): T => {
  const newObj = { ...obj };
  delete (newObj as { pkid?: string }).pkid;
  delete (newObj as { created_by?: string }).created_by;
  delete (newObj as { created_date?: Date }).created_date;
  delete (newObj as { created_host?: boolean }).created_host;
  delete (newObj as { updated_by?: string }).updated_by;
  delete (newObj as { updated_date?: Date }).updated_date;
  delete (newObj as { updated_host?: boolean }).updated_host;
  delete (newObj as { is_deleted?: boolean }).is_deleted;
  delete (newObj as { deleted_by?: string }).deleted_by;
  delete (newObj as { deleted_date?: Date }).deleted_date;
  delete (newObj as { deleted_host?: string }).deleted_host;

  return newObj;
};

export default deleteBaseAttributes;
