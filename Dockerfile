# 👇 FIXED: Changed 18 to 20 to satisfy Next.js 15 requirements
FROM node:20-alpine AS base

# 2. Builder Stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./

# Install dependencies (including devDependencies like TypeScript)
RUN npm install

# 👇 CRITICAL SECTION: Catch the Build Arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_STRIPE_PRICE_ID_PRO
ARG NEXT_PUBLIC_BASE_URL

# 👇 CRITICAL SECTION: Set them as Environment Variables so the build can see them
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=$NEXT_PUBLIC_STRIPE_PRICE_ID_PRO
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Copy the rest of the source code
COPY . .

# Run the build
RUN npm run build

# 3. Production Image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]