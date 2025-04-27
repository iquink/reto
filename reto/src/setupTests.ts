import "@testing-library/jest-dom";

const cssModulesMock = {
  __esModule: true,
  default: new Proxy(
    {},
    {
      get: (_target, prop) => prop, // Returns the class name without a hash
    }
  ),
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vitest.mock("*.module.css", () => cssModulesMock);
