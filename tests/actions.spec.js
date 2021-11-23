const { renderPlop } = require("./render");
const { resolve } = require("path");
const { waitFor } = require("cli-testing-library");
const fs = require("fs");

test("Plop to add files", async () => {
  const { findByText, fireEvent } = await renderPlop([""], {
    cwd: resolve(__dirname, "./examples/add-action"),
    debug: true,
  });

  expect(await findByText("What should the file name be?")).toBeTruthy();

  fireEvent.type("new-output");
  fireEvent.enter();

  const expectedFilePath = resolve(
    __dirname,
    "./examples/add-action/output/new-output.txt"
  );

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = fs.readFileSync(expectedFilePath, "utf8");

  expect(data).toMatch(/Hello/);

  fs.unlinkSync(expectedFilePath);

  fireEvent.sigterm();
});
