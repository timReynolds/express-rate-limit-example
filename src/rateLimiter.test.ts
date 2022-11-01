import { Request, Response, NextFunction } from "express";
import rateLimiter from "./rateLimiter";

describe("rate limiter", () => {
  test("when called once, should call next and inject rate limiter headers", () => {
    // Arrange
    const req = {
      headers: {},
      socket: { remoteAddress: "test" },
    };

    const res = { set: jest.fn() };
    const next = jest.fn();

    // Act
    rateLimiter(req as unknown as Request, res as unknown as Response, next);

    // Assert
    expect(res.set).toBeCalledWith({
      "x-rate-limit": 3,
      "x-rate-remaining": 2,
      "x-rate-reset": expect.anything(),
    });

    expect(next).toBeCalledTimes(1);
  });

  test("When called more times than rate allows, should return 429", () => {
    // Arrange
    const req = {
      headers: {},
      socket: { remoteAddress: "test-2" },
    };

    const res = {
      set: jest.fn(),
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };
    const next = jest.fn();

    // Act
    for (let i = 0; i <= 4; i++) {
      rateLimiter(req as unknown as Request, res as unknown as Response, next);
    }

    // Assert
    expect(res.status).toBeCalledWith(429);
    expect(next).toBeCalledTimes(3);
  });

  test("", () => {});
});
