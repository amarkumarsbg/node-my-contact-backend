import mongoose from "mongoose";
import Contact from "../models/contactModel.js";

//Get all contact
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.log("Error in fetching all contacts", error.message);
    res.status(400).json({ success: false, message: "Server Error" });
  }
};

//get contact for id
export const getContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.log(`Error in fetching  contact by ${id} `, error.message);
    res.status(400).json({ success: false, message: "Server Error" });
  }
};

//create contact
export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res
      .status(400)
      .json({ success: false, message: "All fields are mandatory" });
  }

  const newContact = new Contact({ name, email, phone });

  try {
    await newContact.save();
    res.status(200).json({ success: true, data: newContact });
  } catch (error) {
    console.log("Error in creating contact", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }

  res.status(200).json(newContact);
};

//update contact
export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    const updateContact = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );
    res.status(200).json({ success: true, data: updateContact });
  } catch (error) {
    console.log(`Error in updating contact by ${id} `, error.message);
    res.status(400).json({ success: false, message: "Server Error" });
  }
};

//delete contact
export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteContact = await Contact.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "contact deleted successfully" });
  } catch (error) {
    console.log(`Error in deleting contact by ${id} `, error.message);
    res.status(400).json({ success: false, message: "Server Error" });
  }
};
