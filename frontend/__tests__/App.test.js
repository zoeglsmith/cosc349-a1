import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "..src/App";

describe("App Component", () => {
  // Mocking fetch function
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ _id: "1", text: "Test Todo" }),
    })
  );

  // Clear fetch mock after each test
  afterEach(() => {
    global.fetch.mockClear();
  });

  it("should render the component correctly", () => {
    const { getByText, getByPlaceholderText } = render(<App />);

    // Check if the component renders the title
    expect(getByText("To Do List")).toBeInTheDocument();

    // Check if the input field and buttons are rendered
    expect(getByPlaceholderText("Add a new todo")).toBeInTheDocument();
    expect(getByText("Add")).toBeInTheDocument();
  });

  it("should add a new todo when 'Add' button is clicked", async () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    const inputField = getByPlaceholderText("Add a new todo");
    const addButton = getByText("Add");

    // Type a new todo text and click 'Add' button
    fireEvent.change(inputField, { target: { value: "New Todo Item" } });
    fireEvent.click(addButton);

    // Wait for the fetch call to resolve
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3002/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "New Todo Item" }),
      });
    });

    // Check if the new todo item is displayed
    expect(getByText("New Todo Item")).toBeInTheDocument();
  });

  // Add more test cases for other functionality (editing, deleting, infinite scroll, etc.)
});