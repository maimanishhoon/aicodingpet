# Isolated Swift runner

Build with `docker build -t codepet-swift-runner docker/swift-runner`.

The API must invoke this image through a constrained orchestration layer: read-only source mount, no network, non-root user, CPU/memory limits, and a short timeout. Never execute student code in the Node.js process. This repository intentionally does not expose a host Docker socket to the API container.
