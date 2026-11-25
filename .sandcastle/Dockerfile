# Sandbox image for Fractory Runs in this repository.
# Build: sandcastle docker build-image --image-name sandcastle:entre-a-lei-e-a-rua
# Named in .fractory.json as `sandboxImage`.
FROM node:24-bookworm

# Playwright's Chromium needs these at run time; the rest is the agent's toolchain.
RUN apt-get update && apt-get install -y --no-install-recommends \
  git curl jq ca-certificates \
  libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 \
  libcairo2 fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

# GitHub CLI: Runs open and update pull requests with it.
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && apt-get update && apt-get install -y gh \
  && rm -rf /var/lib/apt/lists/*

# pnpm, pinned to the repo's packageManager field. Installed with npm rather
# than corepack: corepack only shims, then fetches the real binary on first use
# into a cache the agent user cannot write, so every Run would re-download it.
RUN npm install -g pnpm@12.0.0 && pnpm --version

ARG AGENT_UID=1000
ARG AGENT_GID=1000
RUN groupmod -o -g $AGENT_GID node \
  && usermod -o -u $AGENT_UID -g $AGENT_GID -d /home/agent -m -l agent node
USER ${AGENT_UID}:${AGENT_GID}
ENV PATH="/home/agent/.local/bin:$PATH"

# Chromium for the visual comparison against reference/live at 390px and 1280px.
ENV PLAYWRIGHT_BROWSERS_PATH=/home/agent/.cache/ms-playwright
RUN npx --yes playwright@1.56.1 install chromium

RUN curl -fsSL https://claude.ai/install.sh | bash

WORKDIR /home/agent
ENTRYPOINT ["sleep", "infinity"]
