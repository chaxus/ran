ARG PLAYWRIGHT_IMAGE
FROM ${PLAYWRIGHT_IMAGE}
ARG PNPM_VERSION
RUN npm install --global pnpm@${PNPM_VERSION}
WORKDIR /workspace
ENV CI=1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Every package tsconfig extends this; without it the build fails with
# "Tsconfig not found /workspace/tsconfig.base.json".
COPY tsconfig.base.json ./tsconfig.base.json
COPY packages/ranuts/package.json ./packages/ranuts/package.json
COPY packages/ranview/package.json ./packages/ranview/package.json
COPY packages/ranui/package.json ./packages/ranui/package.json
RUN pnpm --filter ranui... install --frozen-lockfile
COPY bin ./bin
COPY packages/ranuts ./packages/ranuts
COPY packages/ranview ./packages/ranview
COPY packages/ranui ./packages/ranui
RUN pnpm --filter ranuts build && pnpm --filter @alixex/ranview build && pnpm --filter ranui build
WORKDIR /workspace/packages/ranui
