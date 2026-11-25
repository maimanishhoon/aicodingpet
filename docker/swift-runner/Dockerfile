FROM swift:6.0-jammy
RUN useradd --create-home --shell /usr/sbin/nologin runner
USER runner
WORKDIR /workspace
ENTRYPOINT ["swiftc"]
