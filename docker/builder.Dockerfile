FROM ubuntu:22.04

ARG ARCH=amd64

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    ca-certificates \
    build-essential \
    git \
    libmagickwand-dev

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

RUN ARCH=$(dpkg --print-architecture) \
    && echo "ARCH: ${ARCH}"

RUN ARCH=$(dpkg --print-architecture) \
    && curl -fsSL https://go.dev/dl/go1.22.5.linux-${ARCH}.tar.gz | tar -C /usr/local -xzf -

RUN ARCH=$(dpkg --print-architecture) \
    && curl -fsSL https://github.com/iconLake/ignite-cli/releases/download/v0.27.3/ignite_0.27.3_linux_${ARCH}.tar.gz | tar -C /usr/local/bin -xzf -

ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH="/go"

WORKDIR /app

CMD ["bash"]
