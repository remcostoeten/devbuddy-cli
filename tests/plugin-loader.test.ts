import { loadPlugins } from "../src/core/plugin-loader"
import { jest } from "@jest/globals" // Import jest

jest.mock("fs/promises")

describe("Plugin Loader", () => {
  it("should load plugins from the plugins directory", async () => {
    const mockReaddir = jest.spyOn(require("fs/promises"), "readdir")
    mockReaddir.mockResolvedValue(["test-plugin.ts"])

    jest.mock(
      "../src/plugins/test-plugin",
      () => ({
        default: {
          name: "test-plugin",
          description: "A test plugin",
          action: jest.fn(),
        },
      }),
      { virtual: true },
    )

    const plugins = await loadPlugins()

    expect(plugins).toHaveLength(1)
    expect(plugins[0].name).toBe("test-plugin")
    expect(plugins[0].description).toBe("A test plugin")
    expect(typeof plugins[0].action).toBe("function")

    mockReaddir.mockRestore()
  })
})

