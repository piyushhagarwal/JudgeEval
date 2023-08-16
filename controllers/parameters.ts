import { Request, Response } from "express";
import queryDatabase from "../database/connection";

export const getAllParameters = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT *
      FROM parameters;
    `;
    const parameters = await queryDatabase(query);
    res.status(200).json({ parameters, success: true });
  } catch (error) {
    res.status(500).json({
      message: "There was an error in fetching all parameters",
      success: false,
    });
  }
};

export const getSingleParameter = async (req: Request, res: Response) => {
  try {
    const parameterId = req.params.id;

    const query = `
      SELECT *
      FROM parameters
      WHERE parameter_id = $1;
    `;

    const parameter = await queryDatabase(query, [parameterId]);

    if (parameter.length === 0) {
      res.status(404).json({ message: "Parameter not found", success: false });
    } else {
      res.status(200).json({ parameter: parameter[0], success: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching the parameter", success: false });
  }
};

export const createParameter = async (req: Request, res: Response) => {
  try {
    const { parameter_name, parameter_description } = req.body;

    const query = `
      INSERT INTO parameters ( parameter_name, parameter_description)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [parameter_name, parameter_description];

    const newParameter = await queryDatabase(query, values);

    res.status(201).json({ newParameter: newParameter[0], success: true });
  } catch (error) {
    res.status(500).json({
      message: "Some error occured during creating parameter",
      success: false,
    });
  }
};

export const updateParameter = async (req: Request, res: Response) => {
  try {
    const parameterId = req.params.id;
    const { parameter_name, parameter_description } = req.body;

    const query = `
      UPDATE parameters
      SET parameter_name = COALESCE($1, parameter_name), parameter_description = COALESCE($2, parameter_description)
      WHERE parameter_id = $3
      RETURNING *;
    `;
    //The COALESCE function is used in the UPDATE query to conditionally update only the non-null values passed in the request. This means if a value is provided in the request body, it will be updated, otherwise, the existing value will be retained.

    const values = [parameter_name, parameter_description, parameterId];

    const updatedParameter = await queryDatabase(query, values);

    if (updatedParameter.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Parameter not found" });
    }

    res.status(200).json({ parameter: updatedParameter[0], success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating the parameter", success: false });
  }
};

export const deleteParameter = async (req: Request, res: Response) => {
  try {
    const parameterId = req.params.id;

    const query = `
      DELETE FROM parameters
      WHERE parameter_id = $1
      RETURNING *;
    `;

    const values = [parameterId];

    const deletedParameter = await queryDatabase(query, values);

    if (deletedParameter.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Parameter not found" });
    }

    res.status(200).json({ parameter: deletedParameter[0], success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting parameter:", success: false });
  }
};
