import { Request, Response, NextFunction } from "express";

const counters: { [key: string]: number } = {};

const TIMESCALE_SECONDS = 10;
const LIMIT = 3;

export default function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const time = Math.floor(Date.now() / 1000 / TIMESCALE_SECONDS);
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const key = `${ip}:${time}`;

  if (counters[key] === undefined) {
    counters[key] = 1;
  } else {
    counters[key]++;
  }

  const remaining = LIMIT - counters[key];

  res.set({
    "x-rate-limit": LIMIT,
    "x-rate-remaining": remaining < 0 ? 0 : LIMIT - counters[key],
    "x-rate-reset": (time + 1) * TIMESCALE_SECONDS,
  });

  if (remaining < 0) {
    res.status(429).send("Too many requests");
  } else {
    next();
  }
}
