# Build arguments
ARG JAVA_VERSION=17
ARG MAVEN_VERSION=3.9

# --- Build stage ---
FROM maven:${MAVEN_VERSION}-eclipse-temurin-${JAVA_VERSION} AS build
WORKDIR /app

# Copy only pom first for dependency cache
COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

# Copy sources
COPY src ./src

# Build jar
RUN mvn -q -DskipTests package

# --- Runtime stage ---
FROM eclipse-temurin:${JAVA_VERSION}-jre-alpine

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

WORKDIR /app

# Copy fat jar
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Expose the port the app will run on
EXPOSE 8080

# JVM optimization flags for containerized environments
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseContainerSupport -XX:+UseG1GC -XX:+UseStringDeduplication"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q -O - http://localhost:8080/actuator/health/liveness || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
