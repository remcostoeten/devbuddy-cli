import { findUIFolder } from "../plugins/tools/ui-folder-manager/find-ui-folder.js";
import fs from "fs/promises";
import path from "path";
import { jest } from "@jest/globals"; // Import jest
jest.mock("fs/promises");
describe("UI Folder Manager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should find UI folder when it exists", async () => {
        fs.readdir.mockResolvedValue(["ui"]);
        const result = await findUIFolder();
        expect(result).toBe(path.join(process.cwd(), "ui"));
    });
    it("should return null when UI folder is not found", async () => {
        fs.readdir.mockResolvedValue(["src", "test"]);
        const result = await findUIFolder();
        expect(result).toBeNull();
    });
});
