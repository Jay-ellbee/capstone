import executeQuery from '../utils/executeQuery.js';

export async function selectData(tableName) {
  try {
    const selectQuery = `SELECT * FROM ${tableName}`;
    const [rows] = await executeQuery(selectQuery);
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function insertData(tableName, data) {
  try {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data)
      .map(() => '?')
      .join(', ');

    const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
    const result = await executeQuery(insertQuery, Object.values(data));

    return result[0];
  } catch (error) {
    throw error;
  }
}

export async function updateData(
  tableName,
  data,
  identifierFields,
  identifierValues
) {
  try {
    const setClause = Object.keys(data)
      .map((column) => `${column} = ?`)
      .join(', ');

    let whereClause = '';
    if (identifierFields && identifierValues) {
      if (Array.isArray(identifierFields) && identifierFields.length > 0) {
        whereClause = ` WHERE ${identifierFields
          .map((field) => `${field} = ?`)
          .join(' AND ')}`;
      } else {
        whereClause = ` WHERE ${identifierFields} = ?`;
      }
    }

    const updateQuery = `UPDATE ${tableName} SET ${setClause}${whereClause}`;

    const [result] = await executeQuery(updateQuery, [
      ...Object.values(data),
      ...(Array.isArray(identifierValues)
        ? identifierValues
        : [identifierValues]),
    ]);

    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteData(
  tableName,
  identifierFields,
  identifierValues
) {
  try {
    let whereClause = '';
    if (identifierFields && identifierValues) {
      if (Array.isArray(identifierFields) && identifierFields.length > 0) {
        whereClause = ` WHERE ${identifierFields
          .map((field) => `${field} = ?`)
          .join(' AND ')}`;
      } else {
        whereClause = ` WHERE ${identifierFields} = ?`;
      }
    }

    const deleteQuery = `DELETE FROM ${tableName}${whereClause}`;
    const [result] = await executeQuery(deleteQuery, [
      ...(Array.isArray(identifierValues)
        ? identifierValues
        : [identifierValues]),
    ]);

    return result;
  } catch (error) {
    throw error;
  }
}
