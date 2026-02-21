# Overview and MCP SDK v2 Notes

## Goal of This Starter

This starter is designed to be a practical baseline for building MCP servers where:

- architecture is simple enough to learn quickly
- structure is clean enough to scale without rewrite
- stdio behavior is safe by default (`stdout` protocol-only, logs to `stderr`)

## Why v2 Matters

Compared to v1-era patterns, this starter focuses on v2-style primitives:

- `registerTool(...)`
- `registerResource(...)`
- `registerPrompt(...)`
- handler context via `ctx` (`ctx.mcpReq.log`, etc.)
- protocol errors via `ProtocolError` + `ProtocolErrorCode`

## Current v2 Constraints

- SDK is still pre-release.
- You should pin your dependency source carefully.
- Breaking API changes are still possible.

This repository handles that by vendoring the server package tarball and exposing a refresh command.

## STDIO Scope

This project intentionally stays stdio-only to reduce moving parts for learning and to keep host integration straightforward.
