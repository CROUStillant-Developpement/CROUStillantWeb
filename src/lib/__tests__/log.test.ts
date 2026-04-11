import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import log from "@/lib/log";

describe("log", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let debugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  // -------------------------------------------------------------------------
  // env='all' — bypasses shouldLogEnv, always logs
  // -------------------------------------------------------------------------
  describe("env='all' (always logs regardless of NODE_ENV)", () => {
    it("log.error calls console.error", () => {
      log.error(["oops"], "all");
      expect(errorSpy).toHaveBeenCalledOnce();
    });

    it("log.warn calls console.warn", () => {
      log.warn(["heads up"], "all");
      expect(warnSpy).toHaveBeenCalledOnce();
    });

    it("log.info calls console.info", () => {
      log.info(["hello"], "all");
      expect(infoSpy).toHaveBeenCalledOnce();
    });

    it("log.debug calls console.debug", () => {
      log.debug(["trace"], "all");
      expect(debugSpy).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // env filtering — dev / prod vs current NODE_ENV
  // -------------------------------------------------------------------------
  describe("env filtering", () => {
    it("does NOT log when env='dev' and NODE_ENV is not 'development'", () => {
      // Vitest runs with NODE_ENV='test' by default
      log.error(["x"], "dev");
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it("does NOT log when env='prod' and NODE_ENV is not 'production'", () => {
      log.error(["x"], "prod");
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it("logs when env='dev' and NODE_ENV='development'", () => {
      vi.stubEnv("NODE_ENV", "development");
      log.error(["x"], "dev");
      expect(errorSpy).toHaveBeenCalledOnce();
    });

    it("logs when env='prod' and NODE_ENV='production'", () => {
      vi.stubEnv("NODE_ENV", "production");
      log.error(["x"], "prod");
      expect(errorSpy).toHaveBeenCalledOnce();
    });

    it("logs when env='all' even in 'production'", () => {
      vi.stubEnv("NODE_ENV", "production");
      log.info(["msg"], "all");
      expect(infoSpy).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // Log level filtering via LOG_LEVEL env variable
  // -------------------------------------------------------------------------
  describe("log level filtering", () => {
    it("suppresses debug when LOG_LEVEL=info", () => {
      vi.stubEnv("LOG_LEVEL", "info");
      log.debug(["trace"], "all");
      expect(debugSpy).not.toHaveBeenCalled();
    });

    it("suppresses debug and info when LOG_LEVEL=warn", () => {
      vi.stubEnv("LOG_LEVEL", "warn");
      log.debug(["d"], "all");
      log.info(["i"], "all");
      expect(debugSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
    });

    it("suppresses debug, info, and warn when LOG_LEVEL=error", () => {
      vi.stubEnv("LOG_LEVEL", "error");
      log.debug(["d"], "all");
      log.info(["i"], "all");
      log.warn(["w"], "all");
      expect(debugSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("still emits error when LOG_LEVEL=error", () => {
      vi.stubEnv("LOG_LEVEL", "error");
      log.error(["boom"], "all");
      expect(errorSpy).toHaveBeenCalledOnce();
    });

    it("emits all levels when LOG_LEVEL=debug (most verbose)", () => {
      vi.stubEnv("LOG_LEVEL", "debug");
      log.error(["e"], "all");
      log.warn(["w"], "all");
      log.info(["i"], "all");
      log.debug(["d"], "all");
      expect(errorSpy).toHaveBeenCalledOnce();
      expect(warnSpy).toHaveBeenCalledOnce();
      expect(infoSpy).toHaveBeenCalledOnce();
      expect(debugSpy).toHaveBeenCalledOnce();
    });

    it("defaults to 'info' level in production (suppresses debug)", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("LOG_LEVEL", ""); // clear override — use env default
      log.debug(["trace"], "all");
      expect(debugSpy).not.toHaveBeenCalled();
    });

    it("defaults to 'info' level in production (info still logs)", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("LOG_LEVEL", "");
      log.info(["msg"], "all");
      expect(infoSpy).toHaveBeenCalledOnce();
    });

    it("ignores an invalid LOG_LEVEL value and falls back to env default", () => {
      vi.stubEnv("LOG_LEVEL", "verbose"); // not a valid LogLevel
      // Falls back to 'debug' in non-production, so all levels should log
      log.debug(["d"], "all");
      expect(debugSpy).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // Output format
  // -------------------------------------------------------------------------
  describe("format", () => {
    it("prefixes console.error call with '[ERROR]'", () => {
      log.error(["boom"], "all");
      expect(errorSpy.mock.calls[0][0]).toBe("[ERROR]");
    });

    it("prefixes console.warn call with '[WARN]'", () => {
      log.warn(["heads up"], "all");
      expect(warnSpy.mock.calls[0][0]).toBe("[WARN]");
    });

    it("prefixes console.info call with '[INFO]'", () => {
      log.info(["hello"], "all");
      expect(infoSpy.mock.calls[0][0]).toBe("[INFO]");
    });

    it("prefixes console.debug call with '[DEBUG]'", () => {
      log.debug(["trace"], "all");
      expect(debugSpy.mock.calls[0][0]).toBe("[DEBUG]");
    });

    it("includes an ISO timestamp as the second argument", () => {
      log.info(["msg"], "all");
      const timestamp = infoSpy.mock.calls[0][1] as string;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("spreads message array items as individual arguments", () => {
      log.error(["part1", "part2", 42], "all");
      const args = errorSpy.mock.calls[0];
      expect(args).toContain("part1");
      expect(args).toContain("part2");
      expect(args).toContain(42);
    });

    it("handles an empty message array", () => {
      log.info([], "all");
      expect(infoSpy).toHaveBeenCalledOnce();
      // First arg is still [INFO], second is timestamp, no further args
      expect(infoSpy.mock.calls[0]).toHaveLength(2);
    });
  });
});
